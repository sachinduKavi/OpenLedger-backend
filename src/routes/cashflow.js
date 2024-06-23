const Router = require('../../custom_package/Route')
const router = new Router()

const {saveCashflowReport} = require('../controllers/cashflow')


router.post('/saveCashflow', saveCashflowReport)


module.exports = router

