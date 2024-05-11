const conn = require('../SQL_Connection')

// Creating new ID by incrementing the last ID
function generateID(lastIdentity) {
    const prefix = lastIdentity.slice(0, 2), numID = parseInt(lastIdentity.slice(2))+1
    let newID = prefix
    for(let i = 0; i < 16-numID.toString().length; i++) newID += "0"
    newID += numID
    console.log(newID)
    return newID
}


// Find the last image ID in the database
async function getLastPictureID() {
    const [imageID] = await conn.promise().query('SELECT image_id FROM image_ref ORDER BY image_id DESC LIMIT 1').catch(err => {
        throw err
    })

    return (imageID.length == 0)
        ? generateID('IR00')
        : generateID(imageID[0]['image_id'])
}


// Get the last used treasury ID
const getLastTreasuryID = async  () => {
    const [userID] = await conn.promise().query('SELECT treasury_ID FROM treasury ORDER BY treasury_ID DESC LIMIT 1').catch(err => {
        throw err
    })
    return (userID.length == 0)
        ? generateID('TS00')
        : generateID(userID[0]['treasury_ID'])
}

module.exports = {
    getLastTreasuryID,
    getLastPictureID
}