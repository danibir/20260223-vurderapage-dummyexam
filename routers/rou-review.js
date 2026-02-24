const express = require('express')
const router = express.Router()

const controller_review = require('../controllers/con-review')
const mid_auth = require('../middleware/mid-auth')

router.get('/create', mid_auth.authLogin, controller_review.create_get)
router.post('/create', mid_auth.authLogin, controller_review.create_post)
router.get('/view/:_id', controller_review.view_get)
router.post('/delete/:_id', mid_auth.authLogin, controller_review.delete_post)

module.exports = router