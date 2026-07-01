const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Import Existing Routes (Events & Auth)
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');

// Import New Routes (Job Portal)
const jobRoutes = require('./routes/jobRoutes');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Enable CORS so your React frontend can communicate with this API
app.use(cors());

// Middleware to parse incoming JSON payloads
app.use(express.json());

// Mount All Slab 2 Routes
app.use('/api/auth', authRoutes);     // Handles user registration & login
app.use('/api/events', eventRoutes);   // Handles event creation, filtering, & registration
app.use('/api', jobRoutes);           // Handles job listings, searching, & applications

// A simple status route to confirm everything works
app.get('/api/status', (req, res) => {
    res.status(200).json({ message: 'Slab 2 Full-Stack Server is up and running smoothly!' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in development mode on port ${PORT}`);
});
