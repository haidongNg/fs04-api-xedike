const express = require('express');
const { authenticating, authorizing } = require('../../../middleware/auth');
const tripController = require('./trips');

const router = express.Router();

// trip
router.get('/:tripId', tripController.getTrip);

router.get('/', tripController.getAllTrip);

router.delete('/:tripId',
    authenticating,
    authorizing(['driver']),
    tripController.deleteTrip);

router.put('/:tripId',
    authenticating,
    authorizing(['driver']),
    tripController.updateTrip)
router.post('/create-trip',
    authenticating, authorizing(['driver']),
    tripController.createTrip);

// book-trip
router.post('/book-trip/:tripId',
    authenticating, authorizing(['passenger']),
    tripController.bookTrip);

router.post('/cancel/:tripId',
    authenticating,
    authorizing(['passenger']),
    tripController.cancelBookTrip)

module.exports = router;