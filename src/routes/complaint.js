const Router = require('../../custom_package/Route')
const router = new Router()

const {createComplaint, loadComplaints} = require('../controllers/complaint')


router.post('/createComplaint', createComplaint)

router.get('/loadComplaints', loadComplaints)


module.exports = router