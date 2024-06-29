const Router = require('../../custom_package/Route')
const router = new Router()

const {saveCashflowReport, loadAllCashflow, getCashflowReport} = require('../controllers/cashflow')


router.post('/saveCashflow', saveCashflowReport)

router.get('/loadAllCashflow', loadAllCashflow)

router.post('/getCashflowReport', getCashflowReport)


module.exports = router

