const Router = require('../../custom_package/Route')
const router = new Router()


const {saveCollection, getAllCollections, discardCollection, fetchSingleRecord, checkWithdraw, withdrawCollection} = require('../controllers/collection')


router.post('/saveCollection', saveCollection)

router.get('/getAllCollections', getAllCollections)

router.put('/discardCollection', discardCollection)

router.post('/fetchSingleRecord', fetchSingleRecord)

router.post('/withdraw', withdrawCollection)


module.exports = router