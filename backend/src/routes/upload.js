const express = require('express');
const { uploadImages } = require('../controllers/upload');
const { upload } = require('../config/cloudinary');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, upload.array('images', 5), uploadImages); // Allow up to 5 images

module.exports = router;
