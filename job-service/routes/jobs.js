const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const { Job } = require('../models');
const { Application } = require('../models');
const jwt = require('jsonwebtoken');

router.get('/', async (req, res) => {
    const { city, country, title, working_type, page = 1, size = 10 } = req.query;
    const filters = {};

    if (city) filters.city = { [Op.like]: `%${city}%` };
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


router.post('/', async (req, res) => {
    try {
        const job = await Job.create(req.body);
        res.status(201).json(job);
    } catch (err) {
        res.status(400).json({ error: err.message });
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
            order: [['applied_at', 'DESC']]
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

module.exports = router;
