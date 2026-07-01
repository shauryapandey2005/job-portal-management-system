const Job = require('../models/Job');
const Application = require('../models/Application');

// @desc    Get all jobs (with optional search by title or company)
// @route   GET /api/jobs
// @access  Public
exports.getJobs = async (req, res) => {
    try {
        const { search } = req.query;
        let query = {};

        // If a search term is provided, filter by job title or company (case-insensitive)
        if (search) {
            query = {
                $or: [
                    { title: { $regex: search, $options: 'i' } },
                    { company: { $regex: search, $options: 'i' } }
                ]
            };
        }

        const jobs = await Job.find(query);
        res.status(200).json(jobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Apply for a job
// @route   POST /api/jobs/:jobId/apply
// @access  Private
exports.applyForJob = async (req, res) => {
    try {
        const { jobId } = req.params;

        // Verify the job exists
        const job = await Job.findById(jobId);
        if (!job) return res.status(404).json({ message: 'Job not found' });

        // Prevent applying multiple times to the same job
        const existingApp = await Application.findOne({ user: req.user._id, job: jobId });
        if (existingApp) {
            return res.status(400).json({ message: 'You have already applied for this job' });
        }

        const application = await Application.create({
            user: req.user._id,
            job: jobId
        });

        res.status(201).json({ message: 'Successfully applied for job', application });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete an application for a previously applied job
// @route   DELETE /api/applications/:id
// @access  Private
exports.deleteApplication = async (req, res) => {
    try {
        const application = await Application.findById(req.params.id);
        if (!application) return res.status(404).json({ message: 'Application not found' });

        // Authorization check: Make sure this user owns the application
        if (application.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to delete this application' });
        }

        await application.deleteOne();
        res.status(200).json({ message: 'Application deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a new job (For testing purposes)
// @route   POST /api/jobs
// @access  Public
exports.createJob = async (req, res) => {
    try {
        const job = await Job.create(req.body);
        res.status(201).json(job);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
