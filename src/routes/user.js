const Router = require('../../custom_package/Route')
const router = new Router() // Create router instant form router class

const { newUserRegistration, verificationCode, emailValidation, checkLogin, testingFunction } = require('../controllers/user')

const { isAuthenticated } = require('../middleware/auth')



router.post('/newUserRegistration' ,newUserRegistration)

router.post('/verificationCode', verificationCode)

router.post('/codeValidation', emailValidation)

router.post('/checkLogin', checkLogin)

router.post('/testing', testingFunction)



module.exports = router


