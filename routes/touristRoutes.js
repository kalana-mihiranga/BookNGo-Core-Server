const express = require('express');
const { eventBook, getBookings, getBookingById, getTouristCount } = require('../controllers/touristController');
const router = express.Router();

router.post('/eventBooking', eventBook);
router.get('/getBookings', getBookings);
router.get('/getBooking/:id', getBookingById);
router.get('/count', getTouristCount);


module.exports = router;