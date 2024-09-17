const {parseCookies} = require('../middleware/Cookies')
const {verifyToken} = require('../middleware/JWT')
const Complaint = require('../DataModels/Complaint')

// Create new complaint
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


// Request all the complaints related to the treasury
const loadComplaints = async (req, res) => {
    let proceed = true, content = null, errorMessage = null

    const [token, tokenError] = verifyToken(parseCookies(req).user_token)
    if(token) {
        const complaints = await Complaint.fetchComplaints(token.treasury_ID)
        content = complaints.map(element => {
            return element.extractJSON()
        })
    } else {
        // Invalid token
        proceed = false
        errorMessage = tokenError
    }


    res.end(JSON.stringify({
        proceed: proceed,
        content: content,
        errorMessage: errorMessage
    }))
}


module.exports = {
    createComplaint,
    loadComplaints
}