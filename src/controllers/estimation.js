const {verifyToken} = require('../middleware/JWT')
const {parseCookies} = require('../middleware/Cookies')

const EstimateReport = require('../DataModels/EstimateReport')


const saveEstimation = async (req, res) => {
    let proceed = true, errorMessage = null
    // JWT token verification 
    const [token, jwtError] = verifyToken(parseCookies(req).user_token)
    try{
        if(token) {
            const estimate = new EstimateReport(req.body) // New instant of estimate
            await estimate.saveEstimateReport(token.treasury_ID, token.user_ID)
    
        } else {
            // Token error
            proceed = false
            content = jwtError // TokenExpiredError 
        }
    } catch(e) {
        errorMessage = e.name
        proceed = false
    }
    
    
    res.end(JSON.stringify({
        proceed: proceed,
        errorMessage: errorMessage,
    }))
}



module.exports = {
    saveEstimation
}