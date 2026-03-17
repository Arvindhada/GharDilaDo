const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: [true, 'Please add a notification title']
    },
    message: {
        type: String,
        required: [true, 'Please add a notification message']
    },
    type: {
        type: String,
        enum: ['system', 'booking', 'review', 'favorite'],
        default: 'system'
    },
    isRead: {
        type: Boolean,
        default: false
    },
    relatedProperty: {
        type: mongoose.Schema.ObjectId,
        ref: 'Property'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Notification', notificationSchema);
