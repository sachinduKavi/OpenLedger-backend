const Router = require('../../custom_package/Route')
const router = new Router()

const {createAnnouncement} = require('../controllers/announcement')


router.post('/createAnnouncement', createAnnouncement)



module.exports = router
