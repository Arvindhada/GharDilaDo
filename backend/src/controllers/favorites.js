const Favorite = require('../models/Favorite');
const Property = require('../models/Property');

// @desc    Toggle Favorite (Save/Unsave)
// @route   POST /api/favorites/:propertyId
// @access  Private
exports.toggleFavorite = async (req, res) => {
    try {
        const property = await Property.findById(req.params.propertyId);
        if (!property) {
            return res.status(404).json({ success: false, message: 'Property not found' });
        }

        let favorite = await Favorite.findOne({
            user: req.user.id,
            property: req.params.propertyId
        });

        if (favorite) {
            await favorite.deleteOne();
            return res.json({ success: true, message: 'Removed from favorites', isSaved: false });
        }

        favorite = await Favorite.create({
            user: req.user.id,
            property: req.params.propertyId
        });

        res.status(201).json({ success: true, message: 'Added to favorites', isSaved: true });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get user favorites
// @route   GET /api/favorites
// @access  Private
exports.getFavorites = async (req, res) => {
    try {
        const favorites = await Favorite.find({ user: req.user.id }).populate('property');

        // Extract properties from favorites
        const properties = favorites.map(fav => fav.property).filter(p => p != null);

        res.json({
            success: true,
            count: properties.length,
            data: properties
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
