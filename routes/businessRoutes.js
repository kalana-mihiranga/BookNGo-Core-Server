const express = require('express');
const { addEvent } = require('../controllers/businessController');
const router = express.Router();

router.post('/addEvent', addEvent);

module.exports = router;