const express = require('express')
const router = express.Router()

const controller_review = require('../controllers/con-review')
const mid_auth = require('../middleware/mid-auth')

const multer = require("multer")
const upload = multer({ dest: ".temp/" })

router.get('/create', mid_auth.authLogin, controller_review.create_get)
router.post('/create', mid_auth.authLogin, upload.single('image'), controller_review.create_post)
router.get('/view/:_id', controller_review.view_get)
router.post('/delete/:_id', mid_auth.authLogin, controller_review.delete_post)
router.post('/like/:_id', mid_auth.authLogin, controller_review.like_post)
router.post('/dislike/:_id', mid_auth.authLogin, controller_review.dislike_post)
router.post('/report/:_id', mid_auth.authLogin, controller_review.report_post)
router.post('/dismiss/:_id', mid_auth.authAdmin, controller_review.dismiss_post)
router.get('/reported/', mid_auth.authAdmin, controller_review.reports_get)

module.exports = router