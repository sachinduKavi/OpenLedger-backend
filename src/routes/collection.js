const Router = require('../../custom_package/Route')
const router = new Router()


const {saveCollection} = require('../controllers/collection')


router.post('/saveCollection', saveCollection)



module.exports = router