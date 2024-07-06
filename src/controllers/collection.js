const {parseCookies} = require('../middleware/Cookies')
const {verifyToken} = require('../middleware/JWT')

const Collection = require('../DataModels/Collection')


// Create new collection or update values of existing collections
const saveCollection = async (req, res) => {
    let proceed = true, errorMessage = null, content = null // Process variables
    
    const [token, tokenError] = verifyToken(parseCookies(req).user_token)
    if(token) {
        // try {
            // Token is verified
            const collection = new Collection(req.body) // Creating collection instant
            // Set publisher
            collection.setPublisher(token.user_ID)

            // Save values in the database
            content = await collection.saveCollectionDatabase(token.treasury_ID) 
        // } catch(e) {
        //     // Server error
        //     process = false
        //     errorMessage = e.name
        // }
        

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


// Fetch & list all the collections records related to a treasury group
const getAllCollections = async(req, res) => {
    let proceed = true, content = null, errorMessage = null // Process variables

    // Verify use token
    const [token, tokenError] = verifyToken(parseCookies(req).user_token)
    if(token) {
        try{
            content = await Collection.fetchAllCollections(token.treasury_ID)
        } catch(e) {
            process = false
            errorMessage = e.name
        }
        
    } else {
        // Invalid token 
        proceed = false,
        errorMessage = tokenError
    }


    res.end(JSON.stringify({
        proceed: proceed,
        content: content,
        errorMessage: errorMessage
    }))
}



module.exports = {
    saveCollection,
    getAllCollections
}