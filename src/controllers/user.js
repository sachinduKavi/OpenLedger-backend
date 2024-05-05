const bcrypt = require('bcrypt')
const conn = require('../SQL_Connection')
const saltRounds = 6

const { sendAuthMail } = require('../SystemEmail')

const {UserModel, TempCodeModel} = require('../Model')


// Validate the code send by the client/user 
// Registration step 02
const emailValidation = async (req, res) => {
    console.log('Email validation')
    const vCode = req.body['code']
    const userEmail = req.body['userEmail']
    console.log(await lastID('user')) // Temp code please remove 
    // Fetch code from the database
    await conn.query(`SELECT code FROM temp_code WHERE user_email='${userEmail}'`, await ((err, result, fields) => {
        if(err) throw err

        const dbCode = result[0]['code']
        res.end(JSON.stringify({ // Reply for the code
            email_validation: vCode == dbCode
        }))

    }))
    
}

// Generate random code for email verification ...
// Registration step 01
const verificationCode = async (req, res) => {
    let passCode = true
    const randomCode = (Math.random()*10000 + 10000).toFixed(0).toString().substring(1)
    console.log("Random Code : " + randomCode)

    // Delete previous codes sent to the same email address 
    await conn.query(`DELETE FROM temp_code WHERE user_email='${req.body['userEmail']}'`, (err, result) => {
        if(err) passCode = false
        else console.log('Deletion successful')
    })

    // Inserted temp code to the database
    await conn.query(`INSERT INTO temp_code VALUES ('${req.body['userEmail']}', '${randomCode}')`, (err, result) => {
        if(err) passCode = false
        else console.log('Data inserted to the temp_code')
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
    return newID
}


// Find the last ID number use in the database
async function lastID(tableName){
    const result = conn.query('SELECT user_ID from user ORDER BY DESC',)
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
        let idNum = await lastID()
        console.log('testing...')
        await UserModel.insertMany(
            {
                userID: ++idNum,
                userName: req.body['user_name'],
                userEmail: req.body['user_email'],
                passwordHash: hashPass,
                userImageID: req.body['user_image_id'],
                pictureScale: req.body['picture_scale']
            }
        ).then(success => {
            console.log("Registration Success...")
        }).catch(err => {
            console.log(err)
            process_success = false
        })
        
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


// Testing function DELETE 
const testingFunction = async (req, res) => {
    // userName = req.body['user_name']
    console.log(req.body['user_name'])
    res.end(JSON.stringify({
    
    }))
}


module.exports = {
    emailValidation,
    newUserRegistration,
    verificationCode,
    checkLogin,
    testingFunction
}