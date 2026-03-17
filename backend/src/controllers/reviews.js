const Review = require('../models/Review');
const Property = require('../models/Property');

// @desc    Add Review
// @route   POST /api/reviews/:propertyId
// @access  Private
exports.addReview = async (req, res) => {
    try {
        const property = await Property.findById(req.params.propertyId);
        if (!property) {
            return res.status(404).json({ success: false, message: 'Property not found' });
        }

        // Check if user already reviewed this property
        let review = await Review.findOne({
            user: req.user.id,
            property: req.params.propertyId
        });

        if (review) {
            return res.status(400).json({ success: false, message: 'You have already reviewed this property' });
        }

        review = await Review.create({
            property: req.params.propertyId,
            user: req.user.id,
            rating: req.body.rating,
            comment: req.body.comment
        });

        // Update Property's average rating and total reviews
        const reviews = await Review.find({ property: req.params.propertyId });
        const avgRating = reviews.reduce((acc, item) => acc + item.rating, 0) / reviews.length;

        await Property.findByIdAndUpdate(req.params.propertyId, {
            rating: avgRating,
            reviews: reviews.length
        });

        res.status(201).json({ success: true, data: review });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get reviews for a property
// @route   GET /api/reviews/:propertyId
// @access  Public
exports.getPropertyReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ property: req.params.propertyId }).populate('user', 'name');
        res.json({ success: true, data: reviews });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
