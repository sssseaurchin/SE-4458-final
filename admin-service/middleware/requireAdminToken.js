const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const auth = req.headers['authorization'];
    if (!auth || !auth.startsWith('Bearer ')) {
        return res.status(403).json({ error: 'Missing token' });
    }

    const token = auth.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.ADMIN_JWT_SECRET);
        if (!decoded.isAdmin) {
            return res.status(403).json({ error: 'Not an admin token' });
        }

        req.admin = decoded;
        next();
    } catch (err) {
        console.error('Invalid admin token:', err.message);
        return res.status(403).json({ error: 'Invalid admin token' });
    }
};
