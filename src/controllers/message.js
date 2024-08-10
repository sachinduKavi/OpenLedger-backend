const {parseCookies} = require('../middleware/Cookies')
const { verifyToken } = require('../middleware/JWT')
const Message = require('../DataModels/Message')


const newMessage = async (req, res) => {
    console.log('new message')
    let proceed = true, content = null, errorMessage = null // Process variables

    const [token, tokenError] = verifyToken(parseCookies(req).user_token)
    if(token) {
        const message = new Message({...req.body, treasuryID: token.treasury_ID, senderID: token.user_ID})
        console.log(message.extractJSON())
        await message.saveChat()
    } else {
        // Invalid token
        proceed = false
        errorMessage = tokenError
    }

    res.end()
}


module.exports = {
    newMessage
}