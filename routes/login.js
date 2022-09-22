const express = require('express');
const router = express.Router();

const {
    getHtml,
    openingSession,
    sessionData
} = require('../controllers/login');

router.route('/').get(getHtml).post(openingSession)
router.route('/session').get(sessionData)

module.exports = router;