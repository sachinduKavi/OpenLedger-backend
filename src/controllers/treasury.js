const conn = require('../SQL_Connection')
const Treasury = require('../DataModels/Treasury') // Treasury class
const ImageRef = require('../DataModels/ImageRef')

const {getLastTreasuryID}  = require('../middleware/generateID')


// Create new treasury step 01 
const createTreasury = async (req, res) => {
    console.log('Create new treasury...')

    // Creating new Image reference instant
    const treasuryImage = new ImageRef()
    treasuryImage.setAll(
        
    )

    const treasury = new Treasury(
        {
            treasuryID: await getLastTreasuryID()
            // treasuryName: res.body['treasury_name'],
            // description: res.body['description'],
            // memberLimit: res.body['member_limit']
        }
    ) // New treasury instant

    treasury.getTreasuryID()
    

    res.end(JSON.stringify({
        body: req.body
    }))
}


module.exports = {
    createTreasury
}