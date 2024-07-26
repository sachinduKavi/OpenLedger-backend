const Router = require('../../custom_package/Route')
const router = new Router()

const {createComment, fetchAllComment, deleteComment} = require('../controllers/comment')



router.post('/createComment', createComment)

router.post('/fetchAllComment', fetchAllComment)

router.post('/deleteComment', deleteComment)



module.exports = router