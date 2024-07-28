const Router = require('../../custom_package/Route')
const router = new Router()

const {createAnnouncement, loadAllAnnouncements, deleteAnnouncement, toggleLike} = require('../controllers/announcement')


router.post('/createAnnouncement', createAnnouncement)

router.get('/loadAllAnnouncements', loadAllAnnouncements)

router.post('/deleteAnnouncement', deleteAnnouncement)

router.post('/toggleLike', toggleLike)



module.exports = router
