const {verifyToken} = require('../middleware/JWT')
const {parseCookies} = require('../middleware/Cookies')
const CommentModel = require('../DataModels/CommentsModel')



// Creating new comment under the record
const createComment = async (req, res) => {
    console.log('create comment...')
    let proceed = true, content = null, errorMessage = null

    const [token, tokenError] = verifyToken(parseCookies(req).user_token)
    if(token) {
        // creating comment instant
        const comment = new CommentModel(req.body)
        comment.setUserID(token.user_ID) // Setting publisher ID

        await comment.saveComment() // Saving comment in the database
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
    createComment
}