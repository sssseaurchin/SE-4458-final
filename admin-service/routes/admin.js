// admin-service/routes/admin.js
const express = require('express');
const router = express.Router();
const { Job } = require('../models');
const { Admin } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Missing credentials' });

    try {
        const admin = await Admin.findOne({ where: { email } });
        if (!admin) return res.status(403).json({ error: 'Invalid credentials' });

        const valid = await bcrypt.compare(password, admin.password);
        if (!valid) return res.status(403).json({ error: 'Invalid credentials' });

        const token = jwt.sign(
            { id: admin.id, email: admin.email, isAdmin: true },
            process.env.ADMIN_JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// All job routes below require admin token
const requireAdminToken = require('../middleware/requireAdminToken');

// POST /api/v1/admin/jobs – create job
router.post('/jobs', requireAdminToken, async (req, res) => {
    try {
        const job = await Job.create(req.body);
        res.status(201).json(job);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// PUT /api/v1/admin/jobs/:id – update job
router.put('/jobs/:id', requireAdminToken, async (req, res) => {
    try {
        const job = await Job.findByPk(req.params.id);
        if (!job) return res.status(404).json({ error: 'Job not found' });

        await job.update(req.body);
        res.json(job);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE /api/v1/admin/jobs/:id – delete job
router.delete('/jobs/:id', requireAdminToken, async (req, res) => {
    try {
        const job = await Job.findByPk(req.params.id);
        if (!job) return res.status(404).json({ error: 'Job not found' });

        await job.destroy();
        res.json({ message: 'Job deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
