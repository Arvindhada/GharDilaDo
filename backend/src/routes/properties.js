const express = require('express');
const {
    getProperties,
    getProperty,
    createProperty,
    getMyProperties,
    updateProperty,
    deleteProperty
} = require('../controllers/properties');

// AUTH PROTECTORS
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

/**
 * PROPERTY ROUTES
 * Frontend URL mappings for Properties
 */

// Route: /api/properties/me
router.route('/me')
    .get(protect, authorize('broker', 'owner'), getMyProperties); // Dashboard: Fetch user's own properties

// Route: /api/properties
router.route('/')
    .get(getProperties) // Public: Anyone can see listings
    .post(protect, authorize('broker', 'owner'), createProperty); // Protected: Only logged-in Brokers/Owners can add

// Route: /api/properties/:id
router.route('/:id')
    .get(getProperty) // Public: View single property
    .put(protect, authorize('broker', 'owner'), updateProperty) // Protected: update property
    .delete(protect, authorize('broker', 'owner'), deleteProperty); // Protected: delete property

module.exports = router;
