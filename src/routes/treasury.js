const Router = require('../../custom_package/Route')
const router = new Router() // New router instant



router.post('/createTreasury', createTreasury)


module.exports = router