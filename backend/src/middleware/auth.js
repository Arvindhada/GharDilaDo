const jwt = require('jsonwebtoken');

/**
 * AUTH MIDDLEWARE (The Security Guard)
 * Frontend developer's perspective: 
 * This is what verifies the 'token' you send in your Axios headers.
 * If the token is valid, it lets the request continue.
 */

// PROTECT ROUTE: Only logged-in users get past this
exports.protect = async (req, res, next) => {
    let token;

    // Check headers for 'Authorization: Bearer <token>'
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    // If no token, return 401 Unauthorized
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized! No token found.'
        });
    }

    try {
        // Verify token using our JWT_SECRET
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Add user info (id, role) to every request object
        req.user = decoded;

        next(); // Let the request proceed to the controller
    } catch (err) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized! Token failed.'
        });
    }
};

// AUTHORIZE ROLES: Only specific roles can access (e.g., only 'broker' can add property)
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `User role '${req.user.role}' is not authorized to access this route.`
            });
        }
        next();
    };
};
