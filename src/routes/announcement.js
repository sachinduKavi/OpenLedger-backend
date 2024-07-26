const Router = require('../../custom_package/Route')
const router = new Router()

const {createAnnouncement, loadAllAnnouncements, deleteAnnouncement} = require('../controllers/announcement')


router.post('/createAnnouncement', createAnnouncement)

router.get('/loadAllAnnouncements', loadAllAnnouncements)

router.post('/deleteAnnouncement', deleteAnnouncement)


module.exports = router
