const Router = require('../../custom_package/Route')
const router = new Router()

const {generateHash, paymentNotification} = require('../controllers/transaction')


router.post('/generateHash', generateHash)

router.post('/paymentNotification', paymentNotification)


module.exports = router