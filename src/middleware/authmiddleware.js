const jwt = require('jsonwebtoken');
const User = require('../models/User');

// 1. Protect routes - Verifies the JWT and identifies the user
exports.protect = async (req, res, next) => {
    let token;

    // Check if the request has an Authorization header formatted as "Bearer <token>"
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Extract the token string
            token = req.headers.authorization.split(' ')[1];

            // Verify the token using your secret key
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Fetch the user from the database and attach it to the request object (minus the password)
            req.user = await User.findById(decoded.id).select('-password');

            // Move to the next piece of middleware or the controller
            next();
        } catch (error) {
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token provided' });
    }
};

// 2. Admin middleware - Checks if the logged-in user is an admin
exports.admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized as an admin' });
    }
};
