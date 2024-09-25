const Router = require('../../custom_package/Route')
const router = new Router()
const {createPoll, loadVotes, updatePoll, deletePoll} = require('../controllers/vote')


router.post('/createPoll', createPoll)

router.get('/loadVotes', loadVotes)

router.put('/updatePoll', updatePoll)

router.put('/deletePoll', deletePoll)


module.exports = router