const mongoose = require('mongoose')

const UserModel = mongoose.model('user_details', {
    userID: Number,
    userName: String,
    email: String,
    passwordHash: String,
    profileLink: String
}, 'user_details')


const TempCodeModel = mongoose.model('temp_email', {
    userEmail: String,
    code: String,
    time: Date
}, 'temp_code')


module.exports = {
    UserModel,
    TempCodeModel
}
