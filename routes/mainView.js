const express = require('express')
const router = express.Router();

const { mainHtml } = require('../controllers/main.js')
const { auth } = require('../middleware/auth')

router.route('/').get(auth, mainHtml)

module.exports = router