const Router = require('../../custom_package/Route')
const router = new Router()

const {generateHash, paymentNotification, paymentSuccess} = require('../controllers/transaction')

router.post('/generateHash', generateHash)

router.post('/paymentNotification', paymentNotification)

router.post('/paymentSuccess', paymentSuccess)


module.exports = router