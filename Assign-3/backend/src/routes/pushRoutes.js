const express = require('express');
const router = express.Router();
const { handlePushToRepo } = require('../controllers/pushController');

// POST /api/v1/push-to-repo
router.post('/push-to-repo', handlePushToRepo);

module.exports = router;
