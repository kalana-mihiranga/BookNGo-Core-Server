const express = require('express');
const { eventBook } = require('../controllers/touristController');
const router = express.Router();

router.post('/eventBooking', eventBook);

module.exports = router;