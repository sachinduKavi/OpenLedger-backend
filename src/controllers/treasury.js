const conn = require('../SQL_Connection')
const Treasury = require('../DataModels/Treasury') // Treasury class
const ImageRef = require('../DataModels/ImageRef')
const jwt = require('jsonwebtoken')
const {fetchTreasuryParticipants} = require('../dbQuery/treasuryQuery')
const {parseCookies}  = require('../middleware/Cookies')
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
        link: req.body['cover_image_link']})
  
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
            globalVisibility: true,
            memberLimit: req.body['member_limit'],
            publicTreasury: req.body['public_treasury'],
            ownerID: req.body['owner_id'],
            createdDate: req.body['created_date']
        }
    ) 

    // Create new treasury in the database
    if(creationProcess) await treasury.updateDatabase().catch(err => {
        // Error occur during the treasury creation 
        console.log('Treasury creation fail')
        creationProcess = false
        errorMessage = 'ServerError'
        throw err
    })
    

    res.end(JSON.stringify({
        creation: creationProcess,
        error: errorMessage
    }))
}


// Get Participant treasury details for relevant userID
const getParticipantTreasury = async (req, res) => {
    console.log('Get Participants...')
    let getProcess = true, errorMessage = null
    const userID = req.body['user_ID']

    // Extracting user token from the cookies
    const userToken = req.headers
    console.log(parseCookies(req))

    console.log('userID')
    // const userID = 'US0000000000000001'
    // Creating new treasury instants array
    const treasuryArray = await fetchTreasuryParticipants(userID).catch(err => {
        getProcess = false
        errorMessage = 'databaseFetchError'
    })
    // Objects are turn into back to json 
    res.end(JSON.stringify({
        process: getProcess,
        error: errorMessage,
        content: treasuryArray.map(obj => obj.getAllTreasuryData()) // Objects are turned into into json by using map
    }))
}


module.exports = {
    createTreasury,
    getParticipantTreasury
}