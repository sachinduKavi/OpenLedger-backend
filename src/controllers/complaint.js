const {parseCookies} = require('../middleware/Cookies')
const {verifyToken} = require('../middleware/JWT')
const Complaint = require('../DataModels/Complaint')

const createComplaint = async (req, res) => {
    let proceed = true, content = null, errorMessage = null
    
    const [token, tokenError] = verifyToken(parseCookies(req).user_token)
    if(token) {
        const complaint = new Complaint(req.body)

        complaint.setPublisherID(token.user_ID)
        complaint.setTreasuryID(token.treasury_ID)
        
        await complaint.createComplaint()
    } else {
        // Invalid token
        errorMessage = tokenError
        proceed = false
    }
    

    res.end(JSON.stringify({
        proceed: proceed,
        content: content,
        errorMessage: errorMessage
    }))
}


module.exports = {
    createComplaint
}