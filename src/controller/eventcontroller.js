const Event = require('../models/Event');

// @desc    Create a new event
// @route   POST /api/events
// @access  Private (Admin Only)
exports.createEvent = async (req, res) => {
    try {
        const { title, description, date, time, location, capacity } = req.body;

        const event = await Event.create({
            title,
            description,
            date,
            time,
            location,
            capacity,
            createdBy: req.user._id // Pulled from our protect middleware
        });

        res.status(201).json(event);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all events (with optional filtering by date and location)
// @route   GET /api/events
// @access  Public
exports.getEvents = async (req, res) => {
    try {
        const { date, location } = req.query;
        let query = {};

        // If a date is provided in the query string, add it to our search filter
        if (date) {
            query.date = date;
        }

        // If a location is provided, search using a case-insensitive regex
        if (location) {
            query.location = { $regex: location, $options: 'i' };
        }

        const events = await Event.find(query);
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Register for an event
// @route   POST /api/events/:id/register
// @access  Private (Logged-in users)
exports.registerForEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // 1. Validation: Check if capacity is reached
        if (event.registeredUsers.length >= event.capacity) {
            return res.status(400).json({ message: 'Event is at full capacity' });
        }

        // 2. Validation: Check if the user is already registered
        if (event.registeredUsers.includes(req.user._id)) {
            return res.status(400).json({ message: 'You are already registered for this event' });
        }

        // Add the user's ID to the registeredUsers array and save
        event.registeredUsers.push(req.user._id);
        await event.save();

        res.status(200).json({ message: 'Successfully registered for the event', event });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Cancel an event registration
// @route   DELETE /api/events/:id/register
// @access  Private (Logged-in users)
exports.cancelRegistration = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Validation: Check if user is actually registered
        if (!event.registeredUsers.includes(req.user._id)) {
            return res.status(400).json({ message: 'You are not registered for this event' });
        }

        // Remove the user's ID from the array using filter
        event.registeredUsers = event.registeredUsers.filter(
            (userId) => userId.toString() !== req.user._id.toString()
        );

        await event.save();

        res.status(200).json({ message: 'Registration cancelled successfully', event });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
