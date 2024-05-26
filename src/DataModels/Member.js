const User = require('./User')

class Member extends User{
    constructor() {
        super({})
    }
    showPosition() {
        console.log('I am a Member')
    }

}


module.exports = Member