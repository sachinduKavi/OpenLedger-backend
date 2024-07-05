const {parseCookies} = require('../middleware/Cookies')
const {verifyToken} = require('../middleware/JWT')

const Collection = require('../DataModels/Collection')


// Create new collection or update values of existing collections
const saveCollection = async (req, res) => {
    let proceed = true, errorMessage = null, content = null // Process variables
    
    const [token, tokenError] = verifyToken(parseCookies(req).user_token)
    if(token) {
        // Token is verified
        const collection = new Collection(req.body) // Creating collection instant
        // Set publisher
        collection.setPublisher(token.user_ID)

        // Save values in the database
        content = await collection.saveCollectionDatabase() 

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
    saveCollection
}