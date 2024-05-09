const Router = require('../../custom_package/Route')
const router = new Router() // New router instant

const { createTreasury } = require('../controllers/treasury')



router.post('/createTreasury', createTreasury)


module.exports = router