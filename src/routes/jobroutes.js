const express = require('express');
const router = express.Router();
const Job = require('../models/Job'); // Required for search
const Application = require('../models/Application'); // <--- ADDED: Required to fetch applications

const {
  getJobs,
  applyForJob,
  deleteApplication,
  createJob
} = require('../controller/jobController');
const { protect } = require('../middleware/authmiddleware');

// Public Route: View and search all jobs
router.get('/jobs', async (req, res) => {
  try {
    const keyword = req.query.search
      ? {
          $or: [
            { title: { $regex: req.query.search, $options: 'i' } },
            { company: { $regex: req.query.search, $options: 'i' } }
          ]
        }
      : {};

    const jobs = await Job.find(keyword).sort({ createdAt: -1 });

    res.status(200).json(jobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ message: 'Failed to fetch jobs' });
  }
});

// Public Route (Testing): Create a new job
router.post('/jobs', createJob);

// Protected Route: Apply for a job (requires a valid JWT token)
router.post('/jobs/:jobId/apply', protect, applyForJob);

// ==========================================
// NEW ROUTE: GET all applications for the logged-in user
// ==========================================
router.get('/applications', protect, async (req, res) => { // <--- ADDED 'protect' HERE
  try {
    // 1. Find applications where the 'user' field matches the logged-in user's ID
    // 2. Use .populate('job') to attach the full job details
    const applications = await Application.find({ user: req.user._id })
      .populate('job')
      .sort({ createdAt: -1 }); // Show newest first

    res.status(200).json(applications);
  } catch (error) {
    console.error("Error fetching applications:", error);
    res.status(500).json({ message: 'Failed to fetch applications' });
  }
});

// Protected Route: Delete a previous application
router.delete('/applications/:id', protect, deleteApplication);

module.exports = router;
