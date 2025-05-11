const express = require('express');
const { eventBook, getTouristCount } = require('../controllers/touristController');
const router = express.Router();

router.post('/eventBooking', eventBook);
router.get('/count', getTouristCount);


module.exports = router;