const conn = require('../SQL_Connection')
class User {
    #userID = null
    #userName = null
    #userEmail = null
    #passwordHash = null
    #displayPictureID = null


    constructor() {
        console.log('Creating new user instant')
    }

    // Update Database with current data
    async updateDatabase() {
        const [userResult] = await conn.promise().query('INSERT INTO user (user_ID, user_name, user_email, password_hash, display_picture) VALUES (?, ?, ?, ?, ?)',
    [this.#userID, this.#userName, this.#userEmail, this.#passwordHash, this.#displayPictureID])
    }

    setUserID(userID) {
        this.#userID = userID
    }

    setUserName(userName) {
        this.#userName = userName
    }

    setUserEmail(userEmail) {
        this.#userEmail = userEmail
    }

    setPasswordHash(passwordHash) {
        this.#passwordHash = passwordHash
    }

    setDisplayPictureID(displayPictureID){
        this.#displayPictureID = displayPictureID
    }

    getUserId() {
        return this.#userID
    }

    getUserName() {
        return this.#userName
    }

    getUserEmail() {
        return this.#userEmail
    }

    getPassword() {
        return this.#passwordHash
    }

    getDisplayPictureId() {
        return this.#displayPictureID
    }

    getAll() {
        return [
            this.getUserId(),
            this.getUserName(),
            this.getPassword(),
            this.getUserEmail(),
            this.getDisplayPictureId(),
        ]
    }

    setAll(userID, userName, passwordHash, userEmail, displayPictureID) {
        this.setUserID(userID)
        this.setUserName(userName)
        this.setPasswordHash(passwordHash)
        this.setUserEmail(userEmail)
        this.setDisplayPictureID(displayPictureID)
    }
}

module.exports = User