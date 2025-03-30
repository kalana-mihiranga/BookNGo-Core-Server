const express = require('express');
const { touristTest } = require('../controllers/touristController');
const router = express.Router();

router.post('/test', touristTest);

module.exports = router;