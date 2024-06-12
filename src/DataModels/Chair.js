const Member = require('./Member')

class Chair extends Member {
    constructor({userID = null, userName = null, userEmail = null, passwordHash = null, displayPictureID = null, dpLink = null, pictureScale = null}) {
        super({userID: userID, userName: userName, userEmail: userEmail, passwordHash: passwordHash, displayPictureID: displayPictureID, dpLink: dpLink, pictureScale: pictureScale})
    }

    getUserLevel() {
        return super.getUserLevel() + 1
    }
}

module.exports = Chair