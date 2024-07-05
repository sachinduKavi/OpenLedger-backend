const Router = require('../../custom_package/Route')
const router = new Router()


const {saveCollection, getAllCollections} = require('../controllers/collection')


router.post('/saveCollection', saveCollection)

router.get('/getAllCollections', getAllCollections)


module.exports = router