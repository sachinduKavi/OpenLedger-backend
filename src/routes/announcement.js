const Router = require('../../custom_package/Route')
const router = new Router()

const {createAnnouncement, loadAllAnnouncements} = require('../controllers/announcement')


router.post('/createAnnouncement', createAnnouncement)

router.get('/loadAllAnnouncements', loadAllAnnouncements)


module.exports = router
