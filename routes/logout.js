const express = require('express')
const router = express.Router();

const { closingSession, logoutView } = require('../controllers/logout');

router.route('/').get(logoutView);
router.route('/session').get(closingSession)

module.exports = router;