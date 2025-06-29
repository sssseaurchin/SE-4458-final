const express = require('express');
const router = express.Router();
const redis = require('../redisClient');
const jwt = require('jsonwebtoken');

router.post('/', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';
    const { title, city } = req.body;

    if (!token) return res.status(401).json({ error: 'Missing token' });
    if (!title && !city) return res.status(400).json({ error: 'Missing query' });

    try {
        const payload = jwt.verify(token, JWT_SECRET);
        const key = `recent_searches:${payload.id}`;
        const search = JSON.stringify({ title, city, time: Date.now() });

        await redis.lPush(key, search);
        await redis.lTrim(key, 0, 9); // keep only last 10
        await redis.expire(key, 60 * 60 * 24 * 30);

        res.status(200).json({ message: 'Search saved' });
    } catch (err) {
        console.error(err);
        res.status(401).json({ error: 'Invalid token' });
    }
});

router.get('/', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

    if (!token) return res.status(401).json({ error: 'Missing token' });

    try {
        const payload = jwt.verify(token, JWT_SECRET);
        const key = `recent_searches:${payload.id}`;

        const history = await redis.lRange(key, 0, 9);
        const parsed = history.map(JSON.parse);

        res.json(parsed);
    } catch (err) {
        console.error(err);
        res.status(401).json({ error: 'Invalid token' });
    }
});

router.post('/delete', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';
    const { title, city } = req.body;

    if (!token) return res.status(401).json({ error: 'Missing token' });

    try {
        const payload = jwt.verify(token, JWT_SECRET);
        const key = `recent_searches:${payload.id}`;

        const history = await redis.lRange(key, 0, -1);

        const updated = history.filter(entry => {
            const item = JSON.parse(entry);
            return !(item.title === title && item.city === city);
        });

        await redis.del(key);
        for (const item of updated) {
            await redis.rPush(key, item);
        }

        res.json({ message: 'Deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});


module.exports = router;
