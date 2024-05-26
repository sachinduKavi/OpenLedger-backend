const Router = require('../../custom_package/Route')
const router = new Router() // New router instant

const { createTreasury, getParticipantTreasury, verifyTreasury } = require('../controllers/treasury')



router.post('/createTreasury', createTreasury)

router.get('/getParticipant', getParticipantTreasury)

router.post('/verifyTreasury', verifyTreasury)


module.exports = router