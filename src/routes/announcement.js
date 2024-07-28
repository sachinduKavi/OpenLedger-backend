const Router = require('../../custom_package/Route')
const router = new Router()

const {createAnnouncement, loadAllAnnouncements, deleteAnnouncement, toggleLike, postCountParameters} = require('../controllers/announcement')


router.post('/createAnnouncement', createAnnouncement)

router.get('/loadAllAnnouncements', loadAllAnnouncements)

router.post('/deleteAnnouncement', deleteAnnouncement)

router.post('/toggleLike', toggleLike)

router.post('/countParameters', postCountParameters)


module.exports = router
