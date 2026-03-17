// @desc    Upload multiple images
// @route   POST /api/upload
// @access  Private
exports.uploadImages = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ success: false, message: 'Please upload at least one image' });
        }

        const imageUrls = req.files.map(file => file.path);

        res.status(200).json({
            success: true,
            data: imageUrls
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
