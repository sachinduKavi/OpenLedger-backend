class CommentsModel {
    #commentID
    #recordID
    #userID
    #content

    CommentsModel({commentID = null, recordID = null, userID = null, content = null}) {
        this.#commentID = commentID
        this.#recordID = recordID
        this.#userID = userID
        this.#content = content
    }

    
    extractJSON() {
        return {
            commentID: this.#commentID,
            recordID: this.#commentID,
            userID: this.#userID,
            content: this.#content
        }
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

module.exports = Comment