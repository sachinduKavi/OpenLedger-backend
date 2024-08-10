const Router = require('../../custom_package/Route')
const router = new Router()

const {newMessage} = require('../controllers/message')


router.post('/newMessage', newMessage)


module.exports = router;