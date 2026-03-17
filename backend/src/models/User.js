const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * USER MODEL
 * Frontend developer's perspective: 
 * This is exactly like your 'User' interface in TypeScript.
 * It defines what fields a user has in the database.
 */
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    // Roles matched to frontend: seeker, broker, owner
    role: {
        type: String,
        enum: ['seeker', 'broker', 'owner', 'buyer'],
        default: 'seeker'
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,
        select: false // Doesn't return password by default in queries
    },
    phoneNumber: {
        type: String,
        unique: true,
        sparse: true
    },
    // OTP logic for mobile login
    otp: {
        code: String,
        expiresAt: Date
    },
    profilePicture: {
        type: String,
        default: ''
    },
    language: {
        type: String,
        default: 'English'
    },
    city: {
        type: String
    },
    address: {
        type: String
    },
    aadharNumber: {
        type: String
    },
    aadharImage: {
        type: String
    },
    isKycd: {
        type: Boolean,
        default: false
    },
    // Array of Property IDs that the user has 'hearted'
    savedProperties: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Property'
    }]
}, {
    timestamps: true // Automatically adds createdAt and updatedAt
});

// PASSWORD HASHING: 
// Before saving, we encrypt the password so even if DB is leaked, passwords are safe.
userSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// HELPER METHOD: 
// To check if entered password matches the hashed password in DB
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
