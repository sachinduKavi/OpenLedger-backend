const Router = require('../../custom_package/Route')
const router = new Router()

const {createLedgerRecord, allLedgerRecords, loadCategories} = require('../controllers/ledger')


router.post('/createLedgerRecord', createLedgerRecord)

router.get('/allLedgerRecords', allLedgerRecords)

router.get('/loadCategories', loadCategories)


module.exports = router