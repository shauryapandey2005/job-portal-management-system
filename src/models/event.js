const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title for the event']
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    date: {
        type: Date,
        required: [true, 'Please add a date']
    },
    time: {
        type: String,
        required: [true, 'Please add a time']
    },
    location: {
        type: String,
        required: [true, 'Please add a location']
    },
    capacity: {
        type: Number,
        required: [true, 'Please add a capacity limit']
    },
    // Keep track of which admin created this event
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Array of user IDs to track who registered and validate capacity
    registeredUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
}, {
    timestamps: true // Automatically creates 'createdAt' and 'updatedAt' fields
});

module.exports = mongoose.model('Event', EventSchema);
