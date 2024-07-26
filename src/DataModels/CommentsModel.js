const { getCommentID } = require("../middleware/generateID")
const conn = require('../SQL_Connection')


class CommentsModel {
    #commentID
    #recordID
    #userID
    #content

    constructor({commentID = null, recordID = null, userID = null, content = null}) {
        this.#commentID = commentID
        this.#recordID = recordID
        this.#userID = userID
        this.#content = content
    }


    extractJSON() {
        return {
            commentID: this.#commentID,
            recordID: this.#recordID,
            userID: this.#userID,
            content: this.#content
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


    // List all the comment for record ID
    static async listALlComments(recordID) {
        const [commentResult] = await conn.promise().query('SELECT * FROM comments WHERE record_ID = ?',
            [recordID]
        )

        let commentList = []
        // Creating list of comment instances 
        commentResult.forEach(element => {
            commentList.push(new CommentsModel(element))
        });

        return commentList
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