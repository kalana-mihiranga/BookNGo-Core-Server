const express = require('express');
const { addEvent, searchEvents, updateEvent } = require('../controllers/businessController');
const router = express.Router();

router.post('/addEvent', addEvent);
router.get('/searchEvents', searchEvents);
router.put('/updateEvent/:eventId', updateEvent);

module.exports = router;