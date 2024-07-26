const Router = require('../../custom_package/Route')
const router = new Router()

const {createComment, fetchAllComment} = require('../controllers/comment')



router.post('/createComment', createComment)

router.post('/fetchAllComment', fetchAllComment)



module.exports = router