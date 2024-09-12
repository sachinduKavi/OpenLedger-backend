const Router = require('../../custom_package/Route')
const router = new Router()

const {createComplaint} = require('../controllers/complaint')


router.post('/createComplaint', createComplaint)


module.exports = router