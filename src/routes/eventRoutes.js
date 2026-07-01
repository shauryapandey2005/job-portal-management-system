const express = require('express');
const router = express.Router();
const {
    createEvent,
    getEvents,
    registerForEvent,
    cancelRegistration
} = require('../controller/eventController');

// Import our security middleware
const { protect, admin } = require('../middleware/authMiddleware');

// Route for getting all events (Public) and creating an event (Admin only)
router.route('/')
    .get(getEvents)
    .post(protect, admin, createEvent);

// Routes for registering and canceling registration (Logged-in users only)
router.route('/:id/register')
    .post(protect, registerForEvent)
    .delete(protect, cancelRegistration);

module.exports = router;
