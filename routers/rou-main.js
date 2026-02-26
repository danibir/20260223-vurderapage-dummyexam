const express = require('express')
const router = express.Router()

const controller_main = require('../controllers/con-main')

router.get('/', controller_main.index_get)
router.get('/faq', controller_main.faq_get)

module.exports = router