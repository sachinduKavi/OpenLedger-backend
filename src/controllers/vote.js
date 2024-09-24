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


    console.log('hello world')
    res.end(JSON.stringify({
        proceed: proceed,
        errorMessage: errorMessage,
        content: content
    }))
}


module.exports = {
    createPoll
}