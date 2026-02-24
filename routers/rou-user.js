const express = require('express')
const router = express.Router()

const controller_user = require('../controllers/con-user')

router.get('/login', controller_user.login_get)
router.post('/login', controller_user.login_post)
router.get('/signup', controller_user.signup_get)
router.post('/signup', controller_user.signup_post)
router.post('/logout', controller_user.logout_post)
router.get('/profile/:username', controller_user.profile_get)
router.post('/delete', controller_user.user_delete)

module.exports = router