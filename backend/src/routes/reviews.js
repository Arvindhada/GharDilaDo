const express = require('express');
const { addReview, getPropertyReviews } = require('../controllers/reviews');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.route('/:propertyId')
    .get(getPropertyReviews) // Public
    .post(protect, addReview); // Protected

module.exports = router;
