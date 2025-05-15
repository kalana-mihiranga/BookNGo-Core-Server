const express = require('express');
const { addEvent, searchEvents, getEventById, disableEvent, getEventsByBusinessId, getBusinessEventsPaginated, getBusinessBookings, getBusinessBasicDetails,getBusinessCount } = require('../controllers/businessController');
const router = express.Router();

router.post('/addEvent', addEvent);
router.get('/searchEvents', searchEvents);
router.get('/getEventById/:id', getEventById);
router.put('/disableEvent/:id', disableEvent);
router.get('/eventsList/:id', getEventsByBusinessId);
router.get('/getPaginatedEvents', getBusinessEventsPaginated);
router.get("/getPaginatedBookings", getBusinessBookings);
router.get("/getBusinessBasicDetails", getBusinessBasicDetails);
router.get('/count', getBusinessCount);

module.exports = router;