const bcrypt = require('bcryptjs')
const conn = require('../SQL_Connection')
const saltRounds = 6

const User = require('../DataModels/User') // Importing User class
const Member = require('../DataModels/Member')
const ImageRef = require('../DataModels/ImageRef') // Importing ImageRef class 

const { sendAuthMail } = require('../SystemEmail')

const {UserModel, TempCodeModel} = require('../Model')
const { checkUserTreasury } = require('../dbQuery/treasuryQuery')
const {signToken, verifyToken} = require('../middleware/JWT')
const { parseCookies } = require('../middleware/Cookies')


// Validate the code send by the client/user 
// Registration step 02
const emailValidation = async (req, res) => {
    const vCode = req.body['code']
    const userEmail = req.body['userEmail']
    // Fetch code from the database
    const [codeResult] = await conn.promise().query('SELECT code FROM temp_code WHERE user_email = ?', userEmail)

    res.end(JSON.stringify({
        email_validation: vCode === codeResult[0]['code']
    }))
}

// Generate random code for email verification ...
// Registration step 01
const verificationCode = async (req, res) => {
    console.log('Reg step 01')
    let passCode = true, errorMessage = null

    // Check whether account already exists 
    const [accountResult] = await conn.promise().query('SELECT user_ID FROM user WHERE user_email = ?', req.body['userEmail'])
    if(accountResult.length == 0) {
        // Account dose not exists in the database
        const randomCode = (Math.random()*10000 + 10000).toFixed(0).toString().substring(1)
        console.log("Random Code : " + randomCode)

        // Delete previous codes sent to the same email address 
        const [deleteResult] = await conn.promise().query('DELETE FROM temp_code WHERE user_email = ?', req.body['userEmail']).catch(err => {
            passCode = false
        })

        // Inserted temp code to the database
        const [insertResult] = await conn.promise().query('INSERT INTO temp_code VALUES (?, ?)', [req.body['userEmail'], randomCode]).catch(err => {
            passCode = false
        })

        // Sending code through email
        if(!(passCode && await sendAuthMail(req.body['userEmail'], randomCode))) passCode = false 
    } else {
        // Account is linked with the email address
        passCode = false
        errorMessage = "accountAlreadyExists"
    }

    // // Respond to client device
    res.end(JSON.stringify({
        codeSent: passCode,
        error: errorMessage
    }))
}

// Creating new ID by incrementing the last ID
function createUserID(lastIdentity) {
    const prefix = lastIdentity.slice(0, 2), numID = parseInt(lastIdentity.slice(2))+1
    let newID = prefix
    for(let i = 0; i < 16-numID.toString().length; i++) newID += "0"
    newID += numID
    console.log(newID)
    return newID
}


// Find the last ID number use in the database
async function getLastUserID() {
    const [userID] = await conn.promise().query('SELECT user_ID FROM user ORDER BY user_ID DESC LIMIT 1').catch(err => {
        throw err
    })

    return (userID.length == 0)
        ? createUserID('US00')
        : createUserID(userID[0]['user_ID'])
}   

// Find the last image ID in the database
async function getLastPictureID() {
    const [imageID] = await conn.promise().query('SELECT image_id FROM image_ref ORDER BY image_id DESC LIMIT 1').catch(err => {
        throw err
    })

    return (imageID.length == 0)
        ? createUserID('IR00')
        : createUserID(imageID[0]['image_id'])
}

// New User registration for system 
// Password are converted to hash code before saving in the database 
// New user registration step 03
const newUserRegistration = async (req, res) => {
    let process_success = true

    try{
        // Converting newly created password to hash code 
        const hashPass = await bcrypt.hash(req.body['userPassword'], saltRounds)
        
        // Generating picture ID
        const pictureID = await getLastPictureID()
        const imageScale = req.body['pictureScale']
        const imageRef = new ImageRef({imageID: pictureID}) // New instant of the image reference (object)
        imageRef.setAll(
            pictureID,
            imageScale['x'],
            imageScale['y'],
            imageScale['scale'],
            req.body['dpLink'],
        )
        // Update image_reference table
        await imageRef.updateDatabase().catch(err => {
            process_success = false
            console.log('Database error')
        })

        // Generating User ID
        const newUserID = await getLastUserID()

        // Creating new User Instant
        const user = new User({})
        user.setAll(
            newUserID,
            req.body.userName,
            hashPass,
            req.body.userEmail,
            pictureID
        ) // Setting all the parameters of user instant
        // Update database with current values
        user.updateDatabase().catch(err => {
            process_success = false
            console.log('Database error')
        })

        // Creating token user_token with the userID contains
        const user_token = signToken({userID: newUserID})
        const userName = req.body['userName']

        //Creating cookie containing the user_token
        res.setHeader('Set-Cookie', `user_token=${user_token}; HttpOnly; Secure; SameSite=None; path=/;`)
        res.writeHead(200)
        // Response to client 
        res.end(JSON.stringify({
            process_success: process_success,
            content: {
                userID: newUserID,
                userName: userName,
                userEmail: req.body['userEmail'],
                pictureScale: imageScale,
                dpLink: req.body['dpLink']
            },
            userSignature: ''
        }))
    } catch(e) {
        // Error occur during the process
        console.log(e)
        res.end(JSON.stringify({
            process_success: false,
            message: e
        }))
    }
    
    
}


// Check login credentials and transfer user data
// User login to the system
const checkLogin = async (req, res) => {
    console.log('check user')
    // Initiate response variables
    let errorMessage = null, validate = false, userDetails = null;

    // try{// Email and password
        const userEmail = req.body['user_email'],
                userPass = req.body['user_pass'];

        let user_ID = null
        // Fetch data from the database
        if(errorMessage == null) {
            const [userResults] = await conn.promise().query('SELECT * FROM user INNER JOIN image_ref ON user.display_picture = image_ref.image_id WHERE user.user_email = ? LIMIT 1', userEmail).catch(err => {
                errorMessage = 'databaseError'
                console.log('databaseError')
            })
        // Check whether the email exists in the database
            if(userResults.length != 0) {
                // Compare hash codes 
                validate = await bcrypt.compare(userPass, userResults[0]['password_hash']) // Compare the hash codes
                if(validate) {
                    user_ID = userResults[0]['user_ID']
                    userDetails = {
                        user_ID: user_ID,
                        user_name: userResults[0]['user_name'],
                        user_email: userResults[0]['user_email'],
                        dp_link: userResults[0]['link'],
                        picture_scale: {
                            x: userResults[0]['x_axis'],
                            y: userResults[0]['y_axis'],
                            scale: userResults[0]['scale']
                        },
                        userSignature: userResults[0]['signature']
                    }
                    
                }
                
          


            } else {
                errorMessage = 'invalidEmail'
            }
        }
    // } catch(e) {
    //     errorMessage = 'severError'
    // }
    // Creating user Instant
    const user = new User({userID: user_ID})
    // res.setHeader('Set-Cookie', `user_ID=${user_ID};Max-Age=3600;path=/;Same-Site=None;Secure`)
    res.setHeader('Set-Cookie', `user_token=${user.createUserIDToken()}; HttpOnly; Secure; SameSite=None; path=/;`)
    res.writeHead(200)
    res.end(JSON.stringify({
        accountValidate: validate,
        error: errorMessage,
        userDetails: userDetails
    }))
}

// Error Log
// bug 01 - request error when request dose not have a body



// Testing function Remove this code before going for the production
const testingFunction = async (req, res) => {
    // Testing function to test the request send 
    console.log('Inside the testing class', req)
   
    res.end() 
}


// Loading the user details as a instant of user class 
const loadUserDetail = async (req, res) => {
    console.log('load user details')
    let proceed = true, errorMessage = null, content = null // Process variables

    const [token, errorToken] = verifyToken(parseCookies(req).user_token)
    if(token) {
        // Verified token 
        const user = new User({userID: req.body.userID})
        await user.fetchUserDetails() // Loading data from the database

        content =user.extractJSON()
    } else {
        // Invalid token
        process = false
        errorMessage = errorToken
    }



    res.end(JSON.stringify({
        proceed: proceed,
        errorMessage: errorMessage,
        content: content
    }))
}


// Get user details for userID
const fetchUserDetails = async (req, res) => {
    
}


module.exports = {
    emailValidation,
    newUserRegistration,
    verificationCode,
    checkLogin,
    testingFunction,
    loadUserDetail
}