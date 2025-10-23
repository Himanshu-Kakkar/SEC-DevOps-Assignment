const express = require('express');
const router = express.Router();
const { handleGenerateRequest } = require('../controllers/generatorController');

// POST /api/v1/generate
console.log('using generate routes')
router.post('/generate', handleGenerateRequest);

module.exports = router;
