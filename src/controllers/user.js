const bcrypt = require('bcrypt')
const conn = require('../SQL_Connection')
const saltRounds = 6

const { sendAuthMail } = require('../SystemEmail')

const {UserModel, TempCodeModel} = require('../Model')


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
    let passCode = true
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

    // // Sending code through email
    if(!(passCode && await sendAuthMail(req.body['userEmail'], randomCode))) passCode = false 

    // // Respond to client device
    res.end(JSON.stringify({
        codeSent: passCode
    }))
}

// Creating new ID by incrementing the last ID
function createUserID(lastIdentity){
    const prefix = lastIdentity.slice(0, 2), numID = parseInt(lastIdentity.slice(2))+1
    let newID = prefix
    for(let i = 0; i < 8-numID.toString().length; i++) newID += "0"
    newID += numID
    console.log(newID)
    return newID
}


// Find the last ID number use in the database
async function getLastUserID(){
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
    console.log("New user registration ...")

    try{
        
        // Converting newly created password to hash code 
        const hashPass = await bcrypt.hash(req.body['user_password'], saltRounds)
        
        // Generating picture ID
        const pictureID = await getLastPictureID()

        console.log(pictureID, req.body['picture_scale'])

        // Inserting to image reference table
        // const [imageResult] = await conn.promise().query('INSERT INTO image_ref ')


        // await conn.promise().query('INSERT INTO user (user_ID, user_name, user_email, password_hash, display_picture) VALUES(?, ?, ?, ?, ?)',
        // [await getLastUserID(), req.body['user_name'], req.body['user_email'], hashPass, req.body['user_image_id'], req.body]
        //)
        
        // await UserModel.insertMany(
        //     {
        //         userID: ++idNum,
        //         userName: req.body['user_name'],
        //         userEmail: req.body['user_email'],
        //         passwordHash: hashPass,
        //         userImageID: req.body['user_image_id'],
        //         pictureScale: req.body['picture_scale']
        //     }
        // ).then(success => {
        //     console.log("Registration Success...")
        // }).catch(err => {
        //     console.log(err)
        //     process_success = false
        // })
        
        // Response to client 
        res.status(process_success?201:200).json({
            process_success: process_success
        })
    } catch(e) {
        // Error occur during the process
        res.end(JSON.stringify({
            process_success: false,
            message: e
        }))
    }
    
    
}


// Registration process ...
// Final registration step
const checkLogin = async (req, res) => {
    console.log('user login')
    // Initiate response variables
    let errorMessage = null, validate = false, userDetails = null;

    try{// Email and password
        const userEmail = req.body['user_email'],
                userPass = req.body['user_pass'];

        // Fetch data from the database
        const response = await UserModel.findOne({userEmail: userEmail})

        // Check whether the email exists in the database
        if(response != null) {
            // Hash password compare
            validate = await bcrypt.compare(userPass, response.passwordHash) // Compare the hash codes
            if(validate) userDetails = {
                userID: response.userID,
                userName: response.userName,
                userEmail: response.userEmail,
                userImageID: response.userImageID,
                pictureScale: response.pictureScale
            }
        } else {
            errorMessage = 'invalidEmail'
        }
    } catch(e) {
        errorMessage = 'severError'
    }

    res.end(JSON.stringify({
        accountValidate: validate,
        error: errorMessage,
        userDetails: userDetails
    }))
}

// Error Log
// bug 01 - request error when request dose not have a body



// Testing function DELETE 
const testingFunction = async (req, res) => {
    // Testing function to test the request send 
    console.log('Inside the testing class')

    console.log(await getLastUserID('user'))

    res.end(JSON.stringify({
        test: 'pass'
    }))
}


module.exports = {
    emailValidation,
    newUserRegistration,
    verificationCode,
    checkLogin,
    testingFunction
}