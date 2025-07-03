const express = require('express');
const redis = require('./redisClient');
const app = express();
const PORT = process.env.PORT || 7000;

app.use(express.static('public')); // serve static files (frontend)
app.use(express.json());

/**
 * @route   POST /api/v1/notifications/alerts
 * @desc    Create a new job alert for a user
 */
app.post('/alerts', async (req, res) => {
    const { userId, keywords, city } = req.body;
    const key = `job_alerts:${userId}`;
    if (!userId || !city || !Array.isArray(keywords)) {
        return res.status(400).json({ error: 'Invalid alert format' });
    }
    try {
        const existing = await redis.get(key);
        const alerts = existing ? JSON.parse(existing) : [];
        alerts.push({ keywords, city, createdAt: Date.now() });
        await redis.set(key, JSON.stringify(alerts));
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Failed to add alert' });
    }
});

/**
 * @route   GET /api/v1/notifications/alerts/:userId
 * @desc    Retrieve all job alerts for a user
 */
app.get('/alerts/:userId', async (req, res) => {
    const key = `job_alerts:${req.params.userId}`;
    try {
        const data = await redis.get(key);
        const alerts = data ? JSON.parse(data) : [];
        res.json(alerts);
    } catch {
        res.status(500).json({ error: 'Failed to fetch alerts' });
    }
});

/**
 * @route   DELETE /api/v1/notifications/alerts/:userId
 * @desc    Delete a specific alert for a user
 */
app.delete('/alerts/:userId', async (req, res) => {
    const { keywords, city } = req.body;
    const key = `job_alerts:${req.params.userId}`;
    try {
        const data = await redis.get(key);
        const alerts = data ? JSON.parse(data) : [];
        const filtered = alerts.filter(alert =>
            !(JSON.stringify(alert.keywords) === JSON.stringify(keywords) && alert.city === city)
        );
        await redis.set(key, JSON.stringify(filtered));
        res.json({ success: true });
    } catch {
        res.status(500).json({ error: 'Failed to delete alert' });
    }
});

/**
 * @route   GET /user/:userId/notifications
 * @desc    Retrieve latest user notifications (max 10)
 */
app.get('/user/:userId', async (req, res) => {
    const { userId } = req.params;
    const key = `user_notifications:${userId}`;
    try {
        const data = await redis.LRANGE(key, 0, 9); // last 10 notifications
        const notifications = data.map(item => {
            try {
                return JSON.parse(item);
            } catch {
                console.warn('Skipping malformed notification:', item);
                return null;
            }
        }).filter(Boolean);
        res.json({ data: notifications });
    } catch (err) {
        console.error('Failed to fetch notifications:', err);
        res.status(500).json({ error: 'Failed to fetch notifications' });
    }
});


app.listen(PORT, () => {
    console.log(`Notification UI server running on http://localhost:${PORT}`);
});
