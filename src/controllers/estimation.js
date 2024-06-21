const {verifyToken} = require('../middleware/JWT')
const {parseCookies} = require('../middleware/Cookies')

const EstimateReport = require('../DataModels/EstimateReport')



// Load all the estimation reports related to treasury
const allEstimations = async (req, res) => {
    let process = true, errorMessage = null, content = null
    console.log('all estimation records...')
    // Verify user token 
    const [token, jwtError] = verifyToken(parseCookies(req).user_token)
    try {
        if(token) {
            // Token is verified 
            content = await EstimateReport.fetchAllEstimation(token.treasury_ID)
        } else {
            // Token error
            process = false
            errorMessage = jwtError
        }
    } catch (e) {
        process = false
        errorMessage = 'serverError'
    }
    


    res.end(JSON.stringify({
        process: process,
        errorMessage: errorMessage,
        content: content.map(element => {
            return element.extractJSON()
        })
    }))
}




// Save the given estimation report in the database 
const saveEstimation = async (req, res) => {
    console.log('save estimation')
    let proceed = true, errorMessage = null, estimationID
    // JWT token verification 
    const [token, jwtError] = verifyToken(parseCookies(req).user_token)
    try{
        if(token) {
            const estimate = new EstimateReport(req.body) // New instant of estimate
            estimationID = await estimate.saveEstimateReport(token.treasury_ID, token.user_ID)
    
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
        estimationID: estimationID
    }))
}




// Delete the estimation record
const deleteEstimation = async (req, res) => {
    let proceed = true, errorMessage = null

    // Verify user token
    const [token, tokenError] = verifyToken(parseCookies(req).user_token)
    // console.log(token, parseCookies(req), req)
    if(token) {
        // Valid token
        const estimate = new EstimateReport(req.body)
        await estimate.deleteEstimateRecord()
    } else {
        // Invalid token
        proceed = false
        errorMessage = tokenError
    }

    res.end(JSON.stringify({
        proceed: proceed,
        errorMessage: errorMessage
    }))
}



module.exports = {
    saveEstimation,
    allEstimations,
    deleteEstimation
}