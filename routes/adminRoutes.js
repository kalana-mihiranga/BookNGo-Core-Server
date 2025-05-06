const express = require('express');
const { adminTest } = require('../controllers/adminController');
const router = express.Router();

router.post('/test', adminTest);

module.exports = router;