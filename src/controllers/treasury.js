const Treasury = require('../DataModels/Treasury') // Treasury class
const ImageRef = require('../DataModels/ImageRef')
const jwt = require('jsonwebtoken')
const {SECRET_KEY} = require('../middleware/KEYS')
const {fetchTreasuryParticipants, checkUserTreasury} = require('../dbQuery/treasuryQuery')
const {parseCookies}  = require('../middleware/Cookies')
const {getLastTreasuryID, getLastPictureID}  = require('../middleware/generateID')
const {verifyToken, signToken} = require('../middleware/JWT')

const Treasurer = require('../DataModels/Treasurer')
const { joinRequest } = require('./user')


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
;
    const treasuryID = await getLastTreasuryID()
    // Create treasury Link
    const treasuryLink = `https://conciliatory-senses.000webhostapp.com/open_ledger/open_ledgerBack.php?treasury=${btoa(treasuryID)}`

    // New treasury instant
    const treasury = new Treasury(
        {
            treasuryID: treasuryID,
            treasuryName: req.body['treasury_name'],
            description: req.body['description'],   
            coverImageID: pictureID,
            treasuryLink: treasuryLink,
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


// Get all the treasury data 
const getTreasuryData = async (req, res) => {
    let process = true, errorMessage = null
    // Creating treasury instant with the treasury ID
    const treasury = new Treasury({treasuryID: req.body['treasuryID']})

    await treasury.fetchFromDatabase().catch(err => {
        process = false
        errorMessage = 'severError'
    })

    res.end(JSON.stringify({
        process: process,
        errorMessage: errorMessage,
        content: treasury.extractJSON()
    }))

}

// Update treasury data by treasurer
const updateTreasurySettings = async (req, res) => {
    let procedure = true, errorMessage = null, updatedTreasury = null
    // Verify user token 
    const [token, jwtError] = verifyToken(parseCookies(req).user_token)
    if(token) {
        // Token is verified 
        // This function is only accessible from treasurer 
        const user = new Treasurer({userID: token.user_ID})
        try {
            // Update value of the treasury
            await user.updateTreasurySettings(token.treasury_ID, req.body.columnName, req.body.newValue)
    
            // Creating new updated treasury instant
            const treasury = new Treasury({treasuryID: token.treasury_ID})
            await treasury.fetchFromDatabase()
    
            updatedTreasury = treasury.extractJSON()
        } catch (e) {
            process = false
            errorMessage = 'severError'
        }

    } else {
        // Token error
        procedure = false
        errorMessage = jwtError
    }

    res.end(JSON.stringify({
        procedure: procedure,
        errorMessage: errorMessage,
        updatedTreasury: updatedTreasury
    }))
    
}


const getAllTreasuryParticipants = async (req, res) => {
    let procedure = true, errorMessage = null, content = null // Process variables

    try {
        // Verifies user token 
        const [token, tokenError] = verifyToken(parseCookies(req).user_token)
        if(token) {
            // Token verified
            const treasury = new Treasury({treasuryID: token.treasury_ID}) // New treasury instant
            const participantObjectArray = await treasury.getAllTreasuryParticipants()
            console.log(participantObjectArray)
            content = participantObjectArray.map(element => {
                return {...element.extractJSON(), user_role: element.getPosition()}
            })
    } else {
        // Invalid token 
        procedure = false
        errorMessage = tokenError
    }
    } catch (e) {
        procedure = false
        errorMessage = 'serverError'
        console.log('try error')
    }

    res.end(JSON.stringify({
        procedure: procedure,
        errorMessage: errorMessage,
        content: content
    }))
}


const loadJoinRequest = async (req, res) => {
    let proceed = true, errorMessage = null, content = null
    // Verify user token 
    const [token, tokenError] = verifyToken(parseCookies(req).user_token)
    if(token) {
        const treasury = new Treasury({treasuryID: token.treasury_ID})
        content = await treasury.loadRequest()
    } else {
        proceed = false
        errorMessage = tokenError
    }

    res.end(JSON.stringify({
        proceed: proceed,
        errorMessage: errorMessage,
        content: content
    }))

}


const deleteRequest = async (req, res) => {
    let proceed = true, errorMessage = null, content = null
    // Verify user token 
    const [token, tokenError] = verifyToken(parseCookies(req).user_token)
    if(token) {
        const treasury = new Treasury({treasuryID: token.treasury_ID})
        await treasury.deleteRequest(req.body.requestID)
    } else {
        // Invalid token
        proceed = false
        errorMessage = tokenError
    }

    res.end(JSON.stringify({
        proceed: proceed,
        errorMessage: errorMessage,
        content: content
    }))
}

 

module.exports = {
    createTreasury,
    getParticipantTreasury,
    verifyTreasury,
    getTreasuryData,
    updateTreasurySettings,
    getAllTreasuryParticipants,
    loadJoinRequest,
    deleteRequest
}