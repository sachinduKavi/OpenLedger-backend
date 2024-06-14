const {parseCookies} = require('../middleware/Cookies')
const {verifyToken} = require('../middleware/JWT')
const LedgerRecord = require('../DataModels/LedgerRecord')
const Treasury = require('../DataModels/Treasury')



// Creating new leader record
const createLedgerRecord = async (req, res) => {
    console.log('create ledger records')
    let process = true, errorMessage = null // State of the request
    // Extracting user cookies and verify the user JWT token
    const [token, token_error] = verifyToken(parseCookies(req).user_token)
    if(token) {
        // Valid user token
        // Creating new ledger record object from the request body
        console.log('request body', req.body)
        const ledgerRecord = new LedgerRecord(req.body)
        if(!await ledgerRecord.createNewRecord()) {
            // Record is not created 
            errorMessage = 'serverError'
            process = false
        }

    } else {
        // Invalid token 
        console.log('Invalid token')
        process = false
        errorMessage = token_error
    }
    
    // Send response to the client about the status of the request 
    res.end(JSON.stringify({procedure: process, errorMessage: errorMessage}))
}


// Fetch all ledger records related to the user and treasury
const allLedgerRecords = async (req, res) => {
    console.log('all ledger records...')
    let procedure = true, errorMessage = null, content = null // Request state variables

    // Extracting user cookies and verify the user JWT token
    const [token, token_error] = verifyToken(parseCookies(req).user_token)
    if(token) {
        // Token is verified
        const treasuryID = token.treasury_ID
        // Fetch all the Ledger records from the database
        const ledgerRecords = await LedgerRecord.fetchAllLedgerRecords(treasuryID).catch(err => {
            procedure = false
            errorMessage = 'serverError'
        }) 

        const ledgerJSONarray = []
        ledgerRecords.forEach(element => {
            ledgerJSONarray.push(element.extractJSON())
        });
        content = ledgerJSONarray
    } else {
        // Invalid token
        procedure = false
        errorMessage = token_error
    }

    res.end(JSON.stringify({
        procedure: procedure,
        errorMessage: errorMessage,
        content: content
    }))
}


// Fetch ledger categories from the database
const loadCategories = async (req, res) => {
    let procedure = true, errorMessage = null, content = null // Procedure status variable
    // Fetch user token 
    const [token, tokenError] = verifyToken(parseCookies(req).user_token)
    if(token) {
        // Token is verified 
        const ledger = new LedgerRecord({treasuryID: token.treasury_ID})
        content = await ledger.fetchAllLedgerCategories()
    } else {
        procedure = false
        errorMessage = tokenError
    }


    res.end(JSON.stringify({
        procedure: procedure,
        errorMessage: errorMessage,
        content: content
    }))

}


module.exports = {
    createLedgerRecord,
    allLedgerRecords,
    loadCategories
}