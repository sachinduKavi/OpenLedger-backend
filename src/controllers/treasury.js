const Treasury = require('../DataModels/Treasury') // Treasury class
const ImageRef = require('../DataModels/ImageRef')
const jwt = require('jsonwebtoken')
const {SECRET_KEY} = require('../middleware/KEYS')
const {fetchTreasuryParticipants, checkUserTreasury} = require('../dbQuery/treasuryQuery')
const {parseCookies}  = require('../middleware/Cookies')
const {getLastTreasuryID, getLastPictureID}  = require('../middleware/generateID')
const {verifyToken, signToken} = require('../middleware/JWT')


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
    let getProcess = true, errorMessage = null, content = null
    // Extracting user token from the cookies
    const user_token = parseCookies(req).user_token
    try {
        // Verify the user_token
        const token = jwt.verify(user_token, SECRET_KEY)
        const treasuryArray = await fetchTreasuryParticipants(token.user_ID).catch(err => {
            getProcess = false
            errorMessage = 'databaseFetchError'
        })
        content = treasuryArray
    } catch(err) {
        console.log('Token Expired..', err)
        getProcess = false
        errorMessage = err.name
        // res.writeHead(404, {'Content-Type': '/login'})
        res.end(err.name)
        return
    }

    // Objects are turn into back to json 
    res.end(JSON.stringify({
        process: getProcess,
        error: errorMessage,
        content: content?.map(obj => obj.getAllTreasuryData()) ?? null// Objects are turned into into json by using map
    }))
    
    
}

// Verify the treasury selected by the user 
// IF the treasury is verifies then treasury token is passed to the client 
const verifyTreasury = async (req, res) => {
    let errorMessage = null, user_role = null, process = true
    console.log('Verify treasury...')
    const treasuryID = req.body['treasury_ID']
    
    const user_token = parseCookies(req).user_token // Fetch cookies from the request
    // Decode the the user token
    const [decodedUserToken, tokenError] = verifyToken(user_token)
    if(tokenError == null) {
        // No token errors
        const userID = decodedUserToken.user_ID
        // Check whether the user ID present in the treasury participants
        const [entranceValidate, userRole] = await checkUserTreasury(userID, treasuryID)
        if(entranceValidate) {
            // Access granted user
            // Create new access token which include both userID and treasuryID
            user_role = userRole
            const user_token = signToken({userID: userID, treasuryID: treasuryID})
            res.setHeader('Set-Cookie', `user_token=${user_token}; HttpOnly; Secure; SameSite=None; path=/;`)
            res.writeHead(200)
        } else {
            // Unauthorized user
            process = false
            errorMessage = 'UnauthorizedUser'
            res.writeHead(200)
        }
    } else {
        // Token error found
        process = false
        errorMessage = tokenError
        res.writeHead(200)
    }

    res.end(JSON.stringify({
        process: process,
        user_role: user_role,
        errorMessage: errorMessage
    }))
}


module.exports = {
    createTreasury,
    getParticipantTreasury,
    verifyTreasury
}