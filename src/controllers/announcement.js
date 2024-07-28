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


// Delete announcement record 
const deleteAnnouncement = async (req, res) => {
    console.log('Delete announcement')
    let proceed = true, content = null, errorMessage = null // Process variables

    const [token, tokenError] = verifyToken(parseCookies(req).user_token)
    if(token) {
        // Creating announcement instant
        const announcement = new Announcement({announcementID: req.body.announcementID})
        await announcement.deleteAnnouncement() // Delete the announcement
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


// Toggling like of the announcement on user request 
const toggleLike = async (req, res) => {
    console.log('Toggle Like')
    let proceed = true, content = null, errorMessage = null // Process variables

    const [token, tokenError] = verifyToken(parseCookies(req).user_token)
    if(token) {
        // Creating announcement instant
        const announcement = new Announcement({announcementID: req.body.announcementID})
        content = await announcement.togglePostLike(token.user_ID)
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


// Count number of likes and comments for one post
const postCountParameters = async (req, res) => {
    console.log('post parameters')
    let proceed = true, content = null, errorMessage = null // Process variables

    const [token, tokenError] = verifyToken(parseCookies(req).user_token)
    if(token) {
        const announcement = new Announcement({announcementID: req.body.announcementID})
        content = await announcement.countParameters(token.user_ID)
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
    createAnnouncement,
    loadAllAnnouncements,
    deleteAnnouncement,
    toggleLike,
    postCountParameters
}