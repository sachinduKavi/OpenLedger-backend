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



// fetch all the comment for relevant recordID
const fetchAllComment = async (req, res) => {
    console.log('fetch comments...')
    let proceed = true, content = null, errorMessage = null // Process variables

    const [token, tokenError] = verifyToken(parseCookies(req).user_token)
    if(token) {
        const tokenList = await CommentModel.listALlComments(req.body.recordID)
        content = tokenList.map(element => {
            return (element.extractJSON())
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


// Delete a comment from the database
const deleteComment = async (req, res) => {
    console.log('delete a comment ')
    let proceed = true, content = null, errorMessage = null // Process variables

    const [token, tokenError] = verifyToken(parseCookies(req).user_token)
    if(token) {
        // Creating instant of the comment
        const comment = new CommentModel({commentID: req.body.commentID})
        await comment.deleteComment() // delete the comment
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
    createComment,
    fetchAllComment,
    deleteComment
}