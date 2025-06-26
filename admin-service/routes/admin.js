const express = require('express');
const router = express.Router();
const { Job } = require('../models');

// Create new job
router.post('/jobs', async (req, res) => {
    try {
        const job = await Job.create(req.body);
        res.status(201).json(job);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Update existing job
router.put('/jobs/:id', async (req, res) => {
    try {
        const job = await Job.findByPk(req.params.id);
        if (!job) return res.status(404).json({ error: 'Job not found' });

        await job.update(req.body);
        res.json(job);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
