const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const { Job } = require('../models');
const { Application } = require('../models');
const adminAuth = require('../middleware/adminAuth');
const redis = require('../redisClient');
const jwt = require('jsonwebtoken');

router.get('/', async (req, res) => {
    const { city, country, title, working_type, page = 1, size = 10 } = req.query;
    const filters = {};

    if (city) {
        if (Array.isArray(city)) {
            filters.city = { [Op.or]: city.map(c => ({ [Op.like]: `%${c}%` })) };
        } else {
            filters.city = { [Op.like]: `%${city}%` };
        }
    }
    if (country) filters.country = { [Op.like]: `%${country}%` };
    if (title) filters.title = { [Op.like]: `%${title}%` }; // new
    if (working_type) filters.working_type = working_type;

    const limit = parseInt(size);
    const offset = (parseInt(page) - 1) * limit;

    try {
        const jobs = await Job.findAndCountAll({
            where: filters,
            limit,
            offset,
            order: [['createdAt', 'DESC']]
        });

        res.json({
            total: jobs.count,
            page: parseInt(page),
            size: limit,
            data: jobs.rows
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// DEBUG
router.get('/test-redis', async (req, res) => {
    await redis.set('hello', 'world');
    const value = await redis.get('hello');
    res.json({ message: value });
});

router.post('/', async (req, res) => {
    try {
        const job = await Job.create(req.body);
        res.status(201).json(job);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// GET /jobs/autocomplete
router.get('/autocomplete', async (req, res) => {
    const { field, query } = req.query;
    const allowedFields = ['title', 'city'];

    if (!allowedFields.includes(field)) {
        return res.status(400).json({ error: 'Invalid autocomplete field' });
    }

    try {
        const results = await Job.findAll({
            where: {
                [field]: { [Op.like]: `%${query}%` }
            },
            attributes: [field],
            group: [field],
            limit: 10
        });

        res.json(results.map(r => r[field])); // use bracket notation to safely access dynamic field
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Autocomplete error' });
    }
});


// GET /api/v1/jobs/applied
router.get('/applied', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

    if (!token) return res.status(401).json({ error: 'Missing token' });

    try {
        const payload = jwt.verify(token, JWT_SECRET);

        const applications = await Application.findAll({
            where: { user_id: payload.id },
            include: [{ model: Job }],
            order: [['updatedAt', 'DESC']]
        });

        const data = applications.map(app => app.Job);
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(401).json({ error: 'Invalid token' });
    }
});

// GET /api/v1/jobs/:id
router.get('/:id', async (req, res) => {
    try {
        const job = await Job.findByPk(req.params.id);
        if (!job) return res.status(404).json({ error: 'Job not found' });
        res.json(job);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// POST /api/v1/jobs/:id/apply
router.post('/:id/apply', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

    if (!token) return res.status(401).json({ error: 'Missing token' });

    try {
        const payload = require('jsonwebtoken').verify(token, JWT_SECRET);

        const existing = await Application.findOne({
            where: { user_id: payload.id, job_id: req.params.id }
        });

        if (existing) return res.status(409).json({ error: 'Already applied' });

        await Application.create({
            user_id: payload.id,
            job_id: req.params.id
        });

        res.json({ message: 'Application submitted' });
    } catch (err) {
        console.error(err);
        res.status(401).json({ error: 'Invalid token' });
    }
});

// Admin Stats Route
router.get('/admin/stats', adminAuth, async (req, res) => {
    try {
        const totalJobs = await Job.count();
        const totalApplications = await Application.count();

        const topJobs = await Job.findAll({
            order: [['application_count', 'DESC']],
            limit: 5,
            attributes: ['title', 'application_count']
        });

        res.json({ totalJobs, totalApplications, topJobs });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Could not retrieve stats' });
    }
});

// GET /api/v1/jobs/admin/:id/applications
router.get('/admin/:id/applications', adminAuth, async (req, res) => {
    const { id } = req.params;

    try {
        const job = await Job.findByPk(id);
        if (!job) return res.status(404).json({ error: 'Job not found' });

        const applications = await Application.findAll({
            where: { job_id: id },
            attributes: ['user_id', 'applied_at', 'createdAt'],
        });

        res.json({ jobTitle: job.title, applications });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Could not fetch applications for this job' });
    }
});

module.exports = router;
