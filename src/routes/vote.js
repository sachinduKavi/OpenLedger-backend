const Router = require('../../custom_package/Route')
const router = new Router()
const {createPoll} = require('../controllers/vote')


router.post('/createPoll', createPoll)


module.exports = router