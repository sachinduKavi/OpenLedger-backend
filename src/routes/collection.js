const Router = require('../../custom_package/Route')
const router = new Router()


const {saveCollection, getAllCollections, discardCollection} = require('../controllers/collection')


router.post('/saveCollection', saveCollection)

router.get('/getAllCollections', getAllCollections)

router.put('/discardCollection', discardCollection)


module.exports = router