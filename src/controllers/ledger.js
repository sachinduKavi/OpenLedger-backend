const {parseCookies} = require('../middleware/Cookies')
const {verifyToken} = require('../middleware/JWT')
const LedgerRecord = require('../DataModels/LedgerRecord')

// Creating new leader record
const createLedgerRecord = async (req, res) => {
    console.log('creating ledger record...')
    let process = true, errorMessage = null // State of the request
    // Extracting user cookies and verify the user JWT token
    const [token, token_error] = verifyToken(parseCookies(req).user_token)
    if(token) {
        // Valid user token
        // Creating new ledger record object from the request body
        const ledgerRecord = new LedgerRecord(req.body)
        

    } else {
        // Invalid token 
        console.log('Invalid token')
        process = false
        errorMessage = token_error
    }
    
    

    res.end(JSON.stringify({token: token, error: token_error}))
}


module.exports = {
    createLedgerRecord
}