const mongoose = require('mongoose');

/**
 * PROPERTY MODEL
 * Frontend developer's perspective: 
 * This model matches your 'Property' interface in properties.ts exactly.
 */
const propertySchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a property title'],
        trim: true
    },
    type: {
        type: String,
        required: [true, 'Please specify property type'],
        enum: ['Flat', 'House', 'Villa', 'Floor', 'Shop']
    },
    locality: {
        type: String,
        required: [true, 'Please add a locality']
    },
    sector: {
        type: String,
        default: ''
    },
    city: {
        type: String,
        default: 'Gandhinagar'
    },
    rent: {
        type: Number,
        required: [true, 'Please add rent amount']
    },
    deposit: {
        type: Number,
        required: [true, 'Please add deposit amount']
    },
    bhk: Number,
    bathrooms: Number,
    area: {
        type: Number, // sq ft
        required: true
    },
    floor: Number,
    totalFloors: Number,
    furnishing: {
        type: String,
        enum: ['Furnished', 'Semi-Furnished', 'Unfurnished'],
        required: true
    },
    available: {
        type: Boolean,
        default: true
    },
    availableFrom: Date,
    postedBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    postedByRole: {
        type: String,
        enum: ['broker', 'owner'],
        required: true
    },
    brokerName: String,
    ownerName: String,
    phone: {
        type: String,
        required: true
    },
    images: [String], // Array of image URLs
    categorizedImages: {
        type: Map,
        of: [String],
        default: {}
    },
    amenities: [String], // Array of amenity strings
    brokerage: {
        type: String,
        default: ''
    },
    description: String,
    isVerified: {
        type: Boolean,
        default: false
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    rating: {
        type: Number,
        default: 0
    },
    reviews: {
        type: Number,
        default: 0
    },
    postedDate: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Property', propertySchema);
