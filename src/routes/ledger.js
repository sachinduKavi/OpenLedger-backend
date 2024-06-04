const Router = require('../../custom_package/Route')
const router = new Router()

const {createLedgerRecord} = require('../controllers/ledger')


router.post('/createLedgerRecord', createLedgerRecord)


module.exports = router