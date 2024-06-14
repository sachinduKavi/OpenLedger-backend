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


// Find the last image ID in the database
async function getLastCategoryID() {
    const [catID] = await conn.promise().query('SELECT category_ID FROM ledger_category ORDER BY category_ID DESC LIMIT 1').catch(err => {
        throw err
    })

    return (catID.length == 0)
        ? generateID('CT00')
        : generateID(catID[0]['category_ID'])
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


// Get the last used treasury ID
const getLastLedgerID = async  () => {
    const [userID] = await conn.promise().query('SELECT record_ID FROM ledger ORDER BY record_ID DESC LIMIT 1').catch(err => {
        throw err
    })
    return (userID.length == 0)
        ? generateID('LR00')
        : generateID(userID[0]['record_ID'])
}


// Get the last used EVIDENCE ID
const getEvidenceID = async  () => {
    const [userID] = await conn.promise().query('SELECT evidence_ID FROM evidence ORDER BY evidence_ID DESC LIMIT 1').catch(err => {
        throw err
    })
    return (userID.length == 0)
        ? generateID('EV00')
        : generateID(userID[0]['evidence_ID'])
}

module.exports = {
    getLastTreasuryID,
    getLastPictureID,
    getLastLedgerID,
    getEvidenceID,
    getLastCategoryID
}