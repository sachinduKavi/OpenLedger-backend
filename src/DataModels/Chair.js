const Member = require('./Member')

class Chair extends Member {
    static position = 'Chair'

    constructor(params) {
        super(params)
    }

    getPosition() {
        return Chair.position
    }

    getUserLevel() {
        return super.getUserLevel() + 1
    }
}

module.exports = Chair