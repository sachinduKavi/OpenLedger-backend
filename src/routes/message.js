const Router = require('../../custom_package/Route')
const router = new Router()

const {newMessage, fetchMessageBlock} = require('../controllers/message')


router.post('/newMessage', newMessage)

router.post('/fetchMessage', fetchMessageBlock)


module.exports = router;