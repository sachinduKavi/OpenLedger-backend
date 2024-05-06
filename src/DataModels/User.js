class User {
    #userID = null
    #userName = null
    #userEmail = null
    #passwordHash = null
    #displayPictureID = null


    constructor() {
        console.log('Creating new user instant')
    }

    setUserID(userID) {
        this.#userID = this.userID
    }

    setUserName(userName) {
        this.#userName = userName
    }
}