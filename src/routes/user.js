const express = require('express')

const { newUserRegistration, verificationCode, emailValidation } = require('../controllers/user')

const router = express.Router()

const { isAuthenticated } = require('../middleware/auth')



router.post('/newUserRegistration', isAuthenticated ,newUserRegistration)

router.post('/verificationCode', verificationCode)

router.post('/codeValidation', emailValidation)



module.exports = router


