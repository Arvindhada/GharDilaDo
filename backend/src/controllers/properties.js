const Property = require('../models/Property');

/**
 * PROPERTY CONTROLLER
 * Frontend developer's perspective: 
 * These functions provide the data for your Home, Search, and Detail screens.
 */

// @desc    Get all properties (with filtering)
// @route   GET /api/properties
// @access  Public
exports.getProperties = async (req, res) => {
    try {
        const {
            type,
            locality,
            isFeatured,
            limit,
            bhk,
            furnishing,
            minRent,
            maxRent,
            search
        } = req.query;

        let query = {};

        // 1. Basic Filters
        if (type) query.type = type;
        if (isFeatured === 'true') query.isFeatured = true;
        if (bhk) query.bhk = parseInt(bhk, 10);
        if (furnishing) query.furnishing = furnishing;

        // 2. Locality (Regex)
        if (locality) query.locality = new RegExp(locality, 'i');

        // 3. Rent Range
        if (minRent || maxRent) {
            query.rent = {};
            if (minRent) query.rent.$gte = parseInt(minRent, 10);
            if (maxRent) query.rent.$lte = parseInt(maxRent, 10);
        }

        // 4. Keyword Search (Title/Description)
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        let mongooseQuery = Property.find(query).populate('postedBy', 'name email phoneNumber');

        // Pagination/Limit
        if (limit) {
            mongooseQuery = mongooseQuery.limit(parseInt(limit, 10));
        }

        const properties = await mongooseQuery;

        res.json({
            success: true,
            count: properties.length,
            data: properties
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get single property detail
// @route   GET /api/properties/:id
// @access  Public
exports.getProperty = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id).populate('postedBy', 'name email phoneNumber');

        if (!property) {
            return res.status(404).json({ success: false, message: 'Property not found' });
        }

        res.json({ success: true, data: property });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Add new property
// @route   POST /api/properties
// @access  Private (Broker or Owner only)
exports.createProperty = async (req, res) => {
    try {
        // req.user comes from our 'protect' middleware
        req.body.postedBy = req.user.id;
        req.body.postedByRole = req.user.role;

        // Auto-fill names and phone from user profile
        if (req.user.role === 'broker') {
            req.body.brokerName = req.user.name;
        } else {
            req.body.ownerName = req.user.name;
        }

        // Auto-fill phone from user profile if not provided in body
        if (!req.body.phone && req.user.phoneNumber) {
            req.body.phone = req.user.phoneNumber;
        }

        // If still no phone (e.g. user profile incomplete), use a fallback or return error
        if (!req.body.phone) {
            return res.status(400).json({ success: false, message: 'Phone number is required for listing' });
        }

        const property = await Property.create(req.body);

        res.status(201).json({ success: true, data: property });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get properties posted by logged-in user (Broker/Owner Dashboard)
// @route   GET /api/properties/me
// @access  Private (Broker or Owner only)
exports.getMyProperties = async (req, res) => {
    try {
        const properties = await Property.find({ postedBy: req.user.id }).populate('postedBy', 'name email phoneNumber');

        res.json({
            success: true,
            count: properties.length,
            data: properties
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update property
// @route   PUT /api/properties/:id
// @access  Private (Broker or Owner only)
exports.updateProperty = async (req, res) => {
    try {
        let property = await Property.findById(req.params.id);

        if (!property) {
            return res.status(404).json({ success: false, message: 'Property not found' });
        }

        // Make sure user is property owner
        if (property.postedBy.toString() !== req.user.id) {
            return res.status(401).json({ success: false, message: 'Not authorized to update this property' });
        }

        property = await Property.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.json({ success: true, data: property });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete property
// @route   DELETE /api/properties/:id
// @access  Private (Broker or Owner only)
exports.deleteProperty = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);

        if (!property) {
            return res.status(404).json({ success: false, message: 'Property not found' });
        }

        // Make sure user is property owner
        if (property.postedBy.toString() !== req.user.id) {
            return res.status(401).json({ success: false, message: 'Not authorized to delete this property' });
        }

        await property.deleteOne();

        res.json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
