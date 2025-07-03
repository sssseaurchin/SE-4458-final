//routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

// POST /api/v1/auth/register
router.post('/register', async (req, res) => {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
        return res.status(400).json({ error: 'All fields required' });
    }

    try {
        const existing = await User.findOne({ where: { email } });
        if (existing) {
            return res.status(409).json({ error: 'Email already registered' });
        }

        const password_hash = await bcrypt.hash(password, 10);
        const user = await User.create({ email, password_hash, name });

        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);
        res.status(201).json({ token, user: { id: user.id, email: user.email, name: user.name } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// POST /api/v1/auth/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(401).json({ error: 'Invalid credentials' });

        const valid = await bcrypt.compare(password, user.password_hash);
        if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);
        res.json({ token, user: { id: user.id, email: user.email, name: user.name, location: user.location} });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// GET /api/v1/auth/me

router.get('/me', async (req, res) => {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Missing or invalid token' });
    }

    try {
        const token = auth.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);

        const user = await User.findByPk(decoded.id);
        if (!user) return res.status(404).json({ error: 'User not found' });

        res.json({ id: user.id, email: user.email, name: user.name, location: user.location });
    } catch (err) {
        console.error(err);
        res.status(401).json({ error: 'Invalid token' });
    }
});

router.put('/me', async (req, res) => {
    const auth = req.headers.authorization;
    if (!auth?.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Missing or invalid token' });
    }

    try {
        const token = auth.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);

        const user = await User.findByPk(decoded.id);
        if (!user) return res.status(404).json({ error: 'User not found' });

        const { name, location } = req.body;

        if (name) user.name = name;
        if (location) user.location = location;
        await user.save();

        res.json({ id: user.id, email: user.email, name: user.name, location: user.location });
    } catch (err) {
        console.error(err);
        res.status(401).json({ error: 'Invalid token' });
    }
});

// Register
router.post('/register', async (req, res) => {
    const { name, email, password, location } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ error: 'Email already registered' });
        }

        const hash = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            email,
            password_hash: hash,
            location
        });

        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1d' });

        res.json({
            message: 'Registration successful',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                location: user.location
            }
        });
    } catch (err) {
        console.error('Registration failed:', err);
        res.status(500).json({ error: 'Registration failed' });
    }
});


module.exports = router;
