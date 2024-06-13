const Chair = require('./Chair')

class CoTreasurer extends Chair{
    static position = 'CoTreasurer'

    getPosition() {
        return CoTreasurer.position
    }

    constructor(params) {
        super(params)
    }

    getUserLevel() {
        return super.getUserLevel() + 1
    }
}

module.exports = CoTreasurer