const jwt = require('jsonwebtoken')
const {SECRET_KEY} = require('./KEYS')


// Verify JWT token and return the payload
const verifyToken = (token) => {
    try {
        return [jwt.verify(token, SECRET_KEY), null]
    } catch(err) {
        return [null, err.name]
    }
}


// Create new token including both 
const signToken = ({userID = null, treasuryID = null}) => {
    return jwt.sign({user_ID: userID, treasury_ID: treasuryID}, SECRET_KEY, { expiresIn: '1h' })
}


module.exports = {
    verifyToken,
    signToken
}