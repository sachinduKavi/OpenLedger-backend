const User = require('./User')

// Member is the lowest level of user inside the treasury group 
class Member extends User{
    constructor({userID = null, userName = null, userEmail = null, passwordHash = null, displayPictureID = null, dpLink = null, pictureScale = null}) {
        super({userID: userID, userName: userName, userEmail: userEmail, passwordHash: passwordHash, displayPictureID: displayPictureID, dpLink: dpLink, pictureScale: pictureScale})
    }

    getUserLevel() {
        return super.getUserLevel() + 1
    }

    // Update treasury status when action is performed to the treasury group
    updateStatus() {
        console.log('Updating treasury status...')
    }

    showPosition() {
        console.log('I am a Member')
    }

}


module.exports = Member