const Router = require('../../custom_package/Route')
const router = new Router()

const {saveEstimation} = require('../controllers/estimation')


router.post('/saveEstimation', saveEstimation)


module.exports = router