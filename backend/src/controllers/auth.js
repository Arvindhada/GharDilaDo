const User = require('../models/User');
const jwt = require('jsonwebtoken');

/**
 * AUTH CONTROLLER
 * Frontend developer's perspective: 
 * These are the functions that handle your login/register forms. 
 */

// @desc    Register user
// @route   POST /api/auth/register
exports.register = async (req, res) => {
    try {
        const { name, email, password, role, phoneNumber } = req.body;

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, message: 'User already exists with this email' });
        }

        // Create new user (Password hashing happens in User model)
        const user = await User.create({ name, email, password, role, phoneNumber });

        // Generate JWT Token
        const token = jwt.sign(
            { id: user._id, role: user.role, name: user.name },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        res.status(201).json({
            success: true,
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user & include password field
        const user = await User.findOne({ email }).select('+password');

        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Generate JWT Token
        const token = jwt.sign(
            { id: user._id, role: user.role, name: user.name },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        res.json({
            success: true,
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Send OTP for mobile login (Real SMS with Twilio)
// @route   POST /api/auth/send-otp
exports.sendOTP = async (req, res) => {
    try {
        const { phoneNumber } = req.body;

        // Generate a random 6-digit code
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString(); // 6‑digit OTP
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

        let user = await User.findOne({ phoneNumber });

        // If user doesn't exist, auto-create a seeker account (common in mobile apps)
        if (!user) {
            const cleanPhone = phoneNumber.replace(/\D/g, ''); // Remove + or other symbols
            user = await User.create({
                name: "New Seeker",
                email: `${cleanPhone}@ghardilado.com`, // valid dummy email format
                password: "defaultPassword123", // dummy password
                phoneNumber: phoneNumber,
                role: 'seeker'
            });
        }

        user.otp = { code: otpCode, expiresAt };
        await user.save();

        console.log(`[OTP GENERATED] Code: ${otpCode} for ${phoneNumber}`);

        // Try to send real SMS via Twilio if configured
        const accountSid = process.env.TWILIO_ACCOUNT_SID;
        const authToken = process.env.TWILIO_AUTH_TOKEN;
        const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

        let twilioSent = false;
        let twilioErrorMsg = '';

        if (accountSid && accountSid !== 'your_twilio_account_sid') {
            try {
                const client = require('twilio')(accountSid, authToken);

                // Reformat phone number for Twilio (assumes India +91 if not provided)
                let formattedPhone = phoneNumber;
                if (!formattedPhone.startsWith('+')) {
                    formattedPhone = '+91' + formattedPhone;
                }

                const message = await client.messages.create({
                    body: `Your GharDilaDo verification code is: ${otpCode}. Valid for 5 minutes.`,
                    from: twilioPhone,
                    to: formattedPhone
                });

                console.log(`[SMS QUEUED] SID: ${message.sid}, Status: ${message.status} for ${formattedPhone}`);
                twilioSent = true;
            } catch (twilioErr) {
                console.log(`[TWILIO ERROR] Could not send SMS: ${twilioErr.message}`);
                // Code 21608 means "unverified number" on trial account
                twilioErrorMsg = twilioErr.message;
            }
        } else {
            console.log(`[TWILIO SKIPPED] Twilio keys not configured. Simulating SMS.`);
        }

        res.json({
            success: true,
            message: twilioSent ? 'OTP sent successfully via SMS' : 'OTP generated (Simulated)',
            // Always return dummy OTP if Twilio fails or is skipped, so developers aren't blocked on Trial accounts
            dummyOtp: twilioSent ? undefined : otpCode,
            warning: twilioErrorMsg ? 'Trial account restriction: ' + twilioErrorMsg : undefined
        });
    } catch (error) {
        console.error('OTP Send Error:', error);
        res.status(500).json({ success: false, message: 'Failed to process OTP request.', error: error.message });
    }
};

// @desc    Verify OTP for mobile login
// @route   POST /api/auth/verify-otp
// @access  Public
exports.verifyOTP = async (req, res) => {
    try {
        const { phoneNumber, otp } = req.body;
        const user = await User.findOne({ phoneNumber });
        if (!user || !user.otp) {
            return res.status(400).json({ success: false, message: 'OTP not requested or user not found' });
        }
        const { code, expiresAt } = user.otp;
        if (code !== otp) {
            return res.status(401).json({ success: false, message: 'Invalid OTP' });
        }
        if (new Date() > expiresAt) {
            return res.status(410).json({ success: false, message: 'OTP expired' });
        }
        // Clear OTP after successful verification
        user.otp = undefined;
        await user.save();
        // Issue JWT token (same as login)
        const token = jwt.sign({ id: user._id, role: user.role, name: user.name }, process.env.JWT_SECRET, { expiresIn: '30d' });
        res.json({ success: true, token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (error) {
        console.error('OTP Verify Error:', error);
        res.status(500).json({ success: false, message: 'Failed to verify OTP', error: error.message });
    }
};

// @desc    Toggle Save Property (Favorite)
// @route   POST /api/auth/save-property
exports.toggleSaveProperty = async (req, res) => {
    try {
        const { propertyId } = req.body;
        const user = await User.findById(req.user.id);

        if (!user) return res.status(404).json({ message: 'User not found' });

        const isSaved = user.savedProperties.includes(propertyId);

        if (isSaved) {
            user.savedProperties = user.savedProperties.filter(id => id.toString() !== propertyId);
        } else {
            user.savedProperties.push(propertyId);
        }

        await user.save();
        res.json({ success: true, savedProperties: user.savedProperties });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get current logged in user profile
// @route   GET /api/auth/profile
// @access  Private
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update user profile details
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res) => {
    try {
        const { name, phoneNumber, language, city, address } = req.body;

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (name) user.name = name;
        if (phoneNumber) user.phoneNumber = phoneNumber;
        if (language) user.language = language;
        if (city) user.city = city;
        if (address) user.address = address;

        // Handle profile picture from frontend
        if (req.body.profilePicture) {
            user.profilePicture = req.body.profilePicture;
        }

        await user.save();

        res.json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Submit KYC details (Aadhar)
// @route   POST /api/auth/kyc
// @access  Private
exports.submitKyc = async (req, res) => {
    try {
        const { city, address, aadharNumber, aadharImage } = req.body;

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (city) user.city = city;
        if (address) user.address = address;
        if (aadharNumber) user.aadharNumber = aadharNumber;
        if (aadharImage) user.aadharImage = aadharImage;
        
        user.isKycd = true;

        await user.save();

        res.json({ success: true, message: 'KYC Verification Successful', data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
