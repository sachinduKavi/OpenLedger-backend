const { parseCookies } = require('../middleware/Cookies')
const { verifyToken } = require('../middleware/JWT')
const Message = require('../DataModels/Message')


// New message is sent from the user
const newMessage = async (req, res) => {
    console.log('new message')
    let proceed = true, content = null, errorMessage = null // Process variables

    const [token, tokenError] = verifyToken(parseCookies(req).user_token)
    if(token) {
        const message = new Message({...req.body, treasuryID: token.treasury_ID, senderID: token.user_ID})
        await message.saveChat()
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



// Fetch 50 messages from the database
const fetchMessageBlock = async (req, res) => {
    let proceed = true, content = null, errorMessage = null

    const [token, tokenError] = verifyToken(parseCookies(req).user_token)
    if(token) { 
        const messageBlock = await Message.fetchMessageBlock(req.body.block, token.treasury_ID)
        content = messageBlock.map(element =>  {
            return element.extractJSON()
        })
    }else {
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
    newMessage,
    fetchMessageBlock
}