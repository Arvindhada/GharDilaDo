const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    property: {
        type: mongoose.Schema.ObjectId,
        ref: 'Property',
        required: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    owner: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    bookingDate: {
        type: Date,
        required: [true, 'Please add a booking date']
    },
    bookingTime: {
        type: String,
        required: [true, 'Please add a booking time']
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'confirmed', 'cancelled', 'completed'],
        default: 'pending'
    },
    message: {
        type: String,
        maxlength: [500, 'Message cannot be more than 500 characters']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Booking', bookingSchema);
