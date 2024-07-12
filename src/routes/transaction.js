const Router = require('../../custom_package/Route')
const router = new Router()

const {generateHash, paymentNotification, paymentSuccess, loadAllTreasuryTransactions} = require('../controllers/transaction')

router.post('/generateHash', generateHash)

router.post('/paymentNotification', paymentNotification)

router.post('/paymentSuccess', paymentSuccess)

router.get('/loadAllTreasuryTransactions', loadAllTreasuryTransactions)


module.exports = router