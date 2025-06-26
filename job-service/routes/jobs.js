const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const { Job } = require('../models');

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

module.exports = router;
