const Router = require('../../custom_package/Route')
const router = new Router()

const {saveEstimation, allEstimations, deleteEstimation} = require('../controllers/estimation')


router.post('/saveEstimation', saveEstimation)

router.get('/allEstimation', allEstimations)

router.post('/deleteEstimation', deleteEstimation)



module.exports = router