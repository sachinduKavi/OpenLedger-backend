const Router = require('../../custom_package/Route')
const router = new Router()

const {saveCashflowReport, loadAllCashflow} = require('../controllers/cashflow')


router.post('/saveCashflow', saveCashflowReport)

router.get('/loadAllCashflow', loadAllCashflow)


module.exports = router

