const { getCommentID } = require("../middleware/generateID")
const conn = require('../SQL_Connection')


class CommentsModel {
    #commentID
    #recordID
    #userID
    #content
    #userName

    constructor({commentID = null, recordID = null, userID = null, content = null, userName = null}) {
        this.#commentID = commentID
        this.#recordID = recordID
        this.#userID = userID
        this.#content = content
        this.#userName = userName
    }


    extractJSON() {
        return {
            commentID: this.#commentID,
            recordID: this.#recordID,
            userID: this.#userID,
            content: this.#content,
            userName: this.#userName
        }
    }

    // Save new comment to the database
    async saveComment() {
        if(this.#commentID === null) {
            // New comment 
            this.#commentID = await getCommentID()
            
            // From announcement table
            await conn.promise().query('INSERT INTO comments (comment_ID, record_ID, user_ID, content) VALUES (?, ?, ?, ?)', 
                [this.#commentID, this.#recordID, this.#userID, this.#content]
            )
      
        }
    }

    // Delete a comment from the database
    async deleteComment() {
        await conn.promise().query('DELETE FROM comments WHERE comment_ID = ?', 
            [this.#commentID]
        )
    }


    // List all the comment for record ID
    static async listALlComments(recordID) {
        const [commentResult] = await conn.promise().query('SELECT comment_ID, record_ID, comments.user_ID, content, user_name FROM comments JOIN user ON comments.user_ID = user.user_ID WHERE record_ID = ?',
            [recordID]
        )

        let commentList = []
        // Creating list of comment instances 
        commentResult.forEach(element => {
            commentList.push(new CommentsModel({
                commentID: element.comment_ID,
                recordID: element.record_ID,
                userID: element.user_ID,
                content: element.content,
                userName: element.user_name
            }))
        });

        return commentList
    }



    getUserName() {
        return this.#userName
    }

    setUserName(userName) {
        this.#userName = userName
    }

    getCommentID() {
        return this.#commentID;
    }

    setCommentID(commentID) {
        this.#commentID = commentID;
    }

    getRecordID() {
        return this.#recordID;
    }

    setRecordID(recordID) {
        this.#recordID = recordID;
    }


    getUserID() {
        return this.#userID;
    }

    setUserID(userID) {
        this.#userID = userID;
    }


    getContent() {
        return this.#content;
    }

    setContent(content) {
        this.#content = content;
    }

}

module.exports = CommentsModel