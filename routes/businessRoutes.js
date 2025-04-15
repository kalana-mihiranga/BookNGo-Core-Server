const express = require('express');
const { addEvent, searchEvents } = require('../controllers/businessController');
const router = express.Router();

router.post('/addEvent', addEvent);
router.get('/searchEvents', searchEvents);

module.exports = router;