const conn = require('../SQL_Connection')
const jwt = require('jsonwebtoken')
const {SECRET_KEY} = require('../middleware/KEYS')
class User {
    #userID 
    #userName 
    #userEmail 
    #passwordHash 
    #displayPictureID 

    constructor({userID = null, userName = null, userEmail = null, passwordHash = null, displayPictureID = null}) {
        this.#userID = userID
        this.#userName = userName
        this.userEmail = userEmail
        this.#passwordHash = passwordHash
        this.displayPictureID = displayPictureID
    }

    showPosition() {
        console.log('I am a user')
    }

    // Update Database with current data
    async updateDatabase() {
        const [userResult] = await conn.promise().query('INSERT INTO user (user_ID, user_name, user_email, password_hash, display_picture) VALUES (?, ?, ?, ?, ?)',
    [this.#userID, this.#userName, this.#userEmail, this.#passwordHash, this.#displayPictureID])
    }

    // Generate json web token for the user ID
    createUserIDToken() {
        return jwt.sign({user_ID: this.#userID}, SECRET_KEY, { expiresIn: '6h' })
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