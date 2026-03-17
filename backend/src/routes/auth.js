const express = require('express');
const { register, login, sendOTP, verifyOTP, toggleSaveProperty, getProfile, updateProfile, submitKyc } = require('../controllers/auth');
const { protect } = require('../middleware/auth');
const router = express.Router();

/**
 * AUTH ROUTES
 * Frontend URL mappings for Authentication
 */

router.post('/register', register);
router.post('/login', login);
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);

// Protected routes (User must be logged in)
router.post('/save-property', protect, toggleSaveProperty);
router.post('/kyc', protect, submitKyc);
router.route('/profile')
    .get(protect, getProfile)
    .put(protect, updateProfile);

module.exports = router;
