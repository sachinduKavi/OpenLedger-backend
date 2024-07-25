const {verifyToken} = require('../middleware/JWT')
const {parseCookies} = require('../middleware/Cookies')
const Announcement = require('../DataModels/Announcement')



// Create new announcement 
const createAnnouncement = async (req, res) => {
    let proceed = true, content = null, errorMessage = null

    const [token, tokenError] = verifyToken(parseCookies(req).user_token)
    if(token) {
        const announcement = new Announcement(req.body)

        // Setting up publisher ID and treasury ID
        announcement.setPublisherID(token.user_ID)
        announcement.setTreasuryID(token.treasury_ID)

        await announcement.saveAnnouncement()
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


// Fetch all the announcements related to the treasury
const loadAllAnnouncements = async (req, res) => {
    console.log('load all announcements')
    let proceed = true, content = null, errorMessage = null // Process variables

    // Verify user token
    const [token, tokenError] = verifyToken(parseCookies(req).user_token)
    if(token) {
        // New announcement instant 
        const announcementList = await Announcement.fetchAllAnnouncements(token.treasury_ID)
        content =  announcementList.map(element => element.extractJSON())
    } else {
        // Invalid token 
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
    createAnnouncement,
    loadAllAnnouncements
}