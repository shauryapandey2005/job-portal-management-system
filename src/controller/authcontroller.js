const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Helper function to generate a JWT token using the secret from .env
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: '30d' // Token remains valid for 30 days
    });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // 1. Check if the user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // 2. Create the user in the database
        const user = await User.create({
            name,
            email,
            password,
            role // Defaults to 'user' if not provided based on our model
        });

        // 3. Respond with user data and the generated JWT token
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id, user.role)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Authenticate user & get token (Login)
// @route   POST /api/auth/login
// @access  Public
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Find user by email and explicitly select the password field
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // 2. Check if the password matches using our custom schema method
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // 3. Respond with user data and a fresh JWT token
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id, user.role)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

