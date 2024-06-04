const {parseCookies} = require('../middleware/Cookies')
const {verifyToken} = require('../middleware/JWT')

// Creating new leader record
const createLedgerRecord = async (req, res) => {
    console.log('creating ledger record...')
    
    // Extracting user cookies and verify the user JWT token
    const [token, token_error] = verifyToken(parseCookies(req).user_token)
    console.log(token)
    res.end(JSON.stringify({token: token, error: token_error}))
}


module.exports = {
    createLedgerRecord
}