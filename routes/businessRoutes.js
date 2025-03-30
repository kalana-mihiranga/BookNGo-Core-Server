const express = require('express');
const { businessTest } = require('../controllers/businessController');
const router = express.Router();

router.post('/test', businessTest);

module.exports = router;