const Router = require('../../custom_package/Route')
const router = new Router()

const {createLedgerRecord, allLedgerRecords} = require('../controllers/ledger')


router.post('/createLedgerRecord', createLedgerRecord)

router.get('/allLedgerRecords', allLedgerRecords)


module.exports = router