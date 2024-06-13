const CoTreasurer = require('./CoTreasurer')
const conn = require('../SQL_Connection')

class Treasurer extends CoTreasurer {
    static position = 'Treasurer'

    getPosition(){
        return Treasurer.position
    }

    constructor(params) {
        super(params)
    }

    // Update treasury settings and data
    async updateTreasurySettings(treasuryID, settingName, newValue) {
        console.log('update treasury settings ', treasuryID, settingName, newValue)
        const [updateResult] = await conn.promise().query(`UPDATE treasury SET ${settingName} = ? WHERE treasury_ID = ?`, [newValue, treasuryID])
        console.log(updateResult)
    }

    getUserLevel() {
        return super.getUserLevel() + 1
    }


}

module.exports = Treasurer