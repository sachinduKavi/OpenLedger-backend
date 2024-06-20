const {verifyToken} = require('../middleware/JWT')
const {parseCookies} = require('../middleware/Cookies')

const EstimateReport = require('../DataModels/EstimateReport')


const saveEstimation = async (req, res) => {
    let proceed = true, errorMessage = null, content = null

    // JWT token verification 
    const [token, jwtError] = verifyToken(parseCookies(req).user_token)
    if(token) {
        const estimate = new EstimateReport(req.body) // New instant of estimate
        await estimate.saveEstimateReport(token.treasury_ID, token.user_ID)

    } else {
        // Token error
    }



    res.end()
}



module.exports = {
    saveEstimation
}