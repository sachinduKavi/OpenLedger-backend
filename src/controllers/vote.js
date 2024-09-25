const {verifyToken} = require('../middleware/JWT')
const {parseCookies} = require('../middleware/Cookies')
const Vote = require('../DataModels/Vote')


const createPoll = async (req, res) => {
    let proceed = true, content = null, errorMessage = null

    const [token, tokenError] = verifyToken(parseCookies(req).user_token)
    if(token) {
        const vote = new Vote(req.body)
        vote.setPublisherID(token.user_ID)
        vote.setTreasuryID(token.treasury_ID)

        await vote.createPoll()

    } else {
        // Invalid token
        errorMessage = tokenError
        proceed = false
    }


    res.end(JSON.stringify({
        proceed: proceed,
        errorMessage: errorMessage,
        content: content
    }))
}


const loadVotes = async (req, res) => {
    let proceed = true, content = null, errorMessage = null

    const [token, tokenError] = verifyToken(parseCookies(req).user_token)
    if(token) {

        const voteList = await Vote.fetchVotes(token.treasury_ID)
        content = voteList.map(element => element.extractJSON())

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


const updatePoll = async (req, res) => {
    console.log('update poll')
    let proceed = true, content = null, errorMessage = null

    const [token, tokenError] = verifyToken(parseCookies(req).user_token)
    if(token) {
        const vote = new Vote({voteID: req.body.voteID, publisherID: token.user_ID, treasuryID: token.treasury_ID})
        await vote.updatePoll(req.body.optionID, req.body.state, req.body.multiple)

        content = vote.extractJSON()
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


const deletePoll = async (req, res) => {
    let proceed = true, content = null, errorMessage = null

    const [token, tokenError] = verifyToken(parseCookies(req).user_token)
    if(token) {
        const vote = new Vote({voteID: req.body.voteID})
        await vote.deletePoll()
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


// Template 
// let proceed = true, content = null, errorMessage = null

//     const [token, tokenError] = verifyToken(parseCookies(req).user_token)
//     if(token) {

//     } else {
//         // Invalid token
//         proceed = false
//         errorMessage = tokenError
//     }

//     res.end(JSON.stringify({
//         proceed: proceed,
//         errorMessage: errorMessage,
//         content: content
//     }))

module.exports = {
    createPoll,
    loadVotes,
    updatePoll,
    deletePoll
}