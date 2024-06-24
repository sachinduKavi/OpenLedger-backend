const {parseCookies} = require('../middleware/Cookies')
const {verifyToken} = require('../middleware/JWT')

const CashflowReportModel = require('../DataModels/CashflowReport')


// Save or update the cashflow record and return the ledger records
const saveCashflowReport = async (req, res) => {
    let proceed = true, errorMessage = null, content = null // Proceed variables
    console.log('Saves cashflow')

    // Verify user token
    const [token, tokenError] = verifyToken(parseCookies(req).user_token)
    if(token) {
        // Token verified 
        const cashflow = new CashflowReportModel(req.body)
        await cashflow.saveCashflowReport(token.user_ID, token.treasury_ID)
        content = cashflow.extractJSON()
    } else {
        // Token error
        proceed = false
        errorMessage = tokenError
    }


    res.end(JSON.stringify({
        proceed: proceed,
        errorMessage: errorMessage,
        content: content
    }))
}



module.exports = {
    saveCashflowReport
}