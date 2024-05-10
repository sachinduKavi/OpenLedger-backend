const conn = require('../SQL_Connection')
const Treasury = require('../DataModels/Treasury') // Treasury class

const {generateID}  = require('../middleware/generateID')


// Get the last used treasury ID
const getLastTreasuryID = async  () => {
    const [userID] = await conn.promise().query('SELECT treasury_ID FROM treasury ORDER BY treasury_ID DESC LIMIT 1').catch(err => {
        throw err
    })
    return (userID.length == 0)
        ? generateID('TS00')
        : generateID(userID[0]['treasury_ID'])
}


// Create new treasury step 01 
const createTreasury = async (req, res) => {
    console.log('Create new treasury...')

    const treasury = new Treasury(
        {
            treasuryID: await getLastTreasuryID()
        }
    ) // New treasury instant
    

    res.end(JSON.stringify({
        body: req.body
    }))
}


module.exports = {
    createTreasury
}