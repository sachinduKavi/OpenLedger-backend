const {parseCookies} = require('../middleware/Cookies')
const {verifyToken} = require('../middleware/JWT')
const LedgerRecord = require('../DataModels/LedgerRecord')

// Creating new leader record
const createLedgerRecord = async (req, res) => {
    console.log('creating ledger record...')
    
    // Extracting user cookies and verify the user JWT token
    const [token, token_error] = verifyToken(parseCookies(req).user_token)
    
    // Creating new ledger record object 
    console.log(typeof req.body)
    const ledgerRecord = new LedgerRecord({title: "Sachindu"})
    console.log(ledgerRecord)

    res.end(JSON.stringify({token: token, error: token_error}))
}


module.exports = {
    createLedgerRecord
}