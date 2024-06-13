const User = require('./User')

// Member is the lowest level of user inside the treasury group 
class Member extends User{
    static position = 'Member'

    getPosition() {
        return Member.position
    }

    constructor(params) {
        super(params)
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