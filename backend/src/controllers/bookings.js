const Booking = require('../models/Booking');
const Property = require('../models/Property');
const Notification = require('../models/Notification');

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
exports.createBooking = async (req, res) => {
    try {
        const { propertyId, bookingDate, bookingTime, message } = req.body;

        const property = await Property.findById(propertyId);
        if (!property) {
            return res.status(404).json({ success: false, message: 'Property not found' });
        }

        const booking = await Booking.create({
            property: propertyId,
            user: req.user.id,
            owner: property.postedBy,
            bookingDate,
            bookingTime,
            message
        });

        // Create notification for owner
        await Notification.create({
            user: property.postedBy,
            title: 'New Booking Request',
            message: `You have a new booking request for ${property.title} on ${bookingDate}`,
            type: 'booking',
            relatedProperty: propertyId
        });

        res.status(201).json({ success: true, data: booking });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get logged in user's bookings (Seeker)
// @route   GET /api/bookings/my
// @access  Private
exports.getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user.id })
            .populate('property', 'title images locality rent')
            .populate('owner', 'name phoneNumber');

        res.json({ success: true, count: bookings.length, data: bookings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get bookings for owner's properties
// @route   GET /api/bookings/owner
// @access  Private
exports.getOwnerBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ owner: req.user.id })
            .populate('property', 'title images locality')
            .populate('user', 'name phoneNumber');

        res.json({ success: true, count: bookings.length, data: bookings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id
// @access  Private
exports.updateBookingStatus = async (req, res) => {
    try {
        const { status } = req.body;
        let booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        // Authorization: Owner can change to anything, User can ONLY change to 'cancelled'
        const isOwner = booking.owner.toString() === req.user.id;
        const isUser = booking.user.toString() === req.user.id;

        if (!isOwner && !isUser) {
            return res.status(401).json({ success: false, message: 'Not authorized to update this booking' });
        }

        if (isUser && !isOwner && status !== 'cancelled') {
            return res.status(401).json({ success: false, message: 'You can only cancel your booking' });
        }

        booking = await Booking.findByIdAndUpdate(req.params.id, { status }, {
            new: true,
            runValidators: true
        });

        // Notify user about status change
        await Notification.create({
            user: booking.user,
            title: `Booking ${status}`,
            message: `Your booking for property has been ${status}`,
            type: 'booking',
            relatedProperty: booking.property
        });

        res.json({ success: true, data: booking });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
