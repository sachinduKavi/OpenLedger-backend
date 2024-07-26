const Router = require('../../custom_package/Route')
const router = new Router()

const {createComment} = require('../controllers/comment')



router.post('/createComment', createComment)



module.exports = router