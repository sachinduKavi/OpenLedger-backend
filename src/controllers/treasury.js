const conn = require('../SQL_Connection')
const Treasury = require('../DataModels/Treasury') // Treasury class
const ImageRef = require('../DataModels/ImageRef')

const {getLastTreasuryID, getLastPictureID}  = require('../middleware/generateID')


// Create new treasury step 01 
const createTreasury = async (req, res) => {
    console.log('Create new treasury...')
    creationProcess = true, errorMessage = null // Initialize the response message

    // Generate new picture ID
    const pictureID = await getLastPictureID()
    console.log('Picture ID : ', pictureID)
    // Creating new Image reference instant
    const treasuryImage = new ImageRef({
        imageID: pictureID,
        link: req.body['cover_image_link']
    })
  
    // Update Image Database
    await treasuryImage.updateDatabase().catch(err => {
        // Error occur during image update
        console.log('Image database update error')
        creationProcess = false
        errorMessage = 'severError'
        throw err
    })

    // New treasury instant
    const treasury = new Treasury(
        {
            treasuryID: await getLastTreasuryID(),
            treasuryName: req.body['treasury_name'],
            description: req.body['description'],
            coverImageID: pictureID,
            globalVisibility: false,
            memberLimit: req.body['member_limit'],
            publicTreasury: req.body['public_treasury'],
            ownerID: req.body['owner_id']
        }
    ) 

    // Create new treasury in the database
    if(creationProcess) await treasury.updateDatabase().catch(err => {
        // Error occur during the treasury creation 
        console.log('Treasury creation fail')
        creationProcess = false
        errorMessage = 'ServerError'
    })
    

    res.end(JSON.stringify({
        creation: creationProcess,
        error: errorMessage
    }))
}


module.exports = {
    createTreasury
}