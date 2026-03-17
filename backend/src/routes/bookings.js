const express = require('express');
const router = express.Router();
const {
    createBooking,
    getMyBookings,
    getOwnerBookings,
    updateBookingStatus
} = require('../controllers/bookings');
const { protect } = require('../middleware/auth');

router.use(protect);

router.post('/', createBooking);
router.get('/my', getMyBookings);
router.get('/owner', getOwnerBookings);
router.put('/:id', updateBookingStatus);

module.exports = router;
