const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const auth = req.headers['authorization'];
    if (!auth || !auth.startsWith('Bearer ')) return res.status(403).json({ error: 'Missing token' });

    const token = auth.split(' ')[1];
    try {
        const decoded = jwt.verify(token, 'admin-secret');
        if (!decoded.isAdmin) throw new Error();
        req.user = decoded;
        next();
    } catch {
        return res.status(403).json({ error: 'Invalid admin token' });
    }
};
