const Router = require('../../custom_package/Route')
const router = new Router() // New router instant

const { createTreasury, getParticipantTreasury, verifyTreasury, getTreasuryData, updateTreasurySettings, getAllTreasuryParticipants, loadJoinRequest, deleteRequest } = require('../controllers/treasury')



router.post('/createTreasury', createTreasury)

router.get('/getParticipant', getParticipantTreasury)

router.post('/verifyTreasury', verifyTreasury)

router.post('/getTreasuryData', getTreasuryData)

router.post('/updateTreasurySettings', updateTreasurySettings)

router.get('/getAllTreasuryParticipants', getAllTreasuryParticipants)

router.get('/loadJoinRequest', loadJoinRequest)

router.put('/deleteRequest', deleteRequest)

module.exports = router