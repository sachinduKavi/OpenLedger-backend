const Router = require('../../custom_package/Route')
const router = new Router() // New router instant

const { createTreasury, getParticipantTreasury } = require('../controllers/treasury')



router.post('/createTreasury', createTreasury)

router.get('/getParticipant', getParticipantTreasury)


module.exports = router