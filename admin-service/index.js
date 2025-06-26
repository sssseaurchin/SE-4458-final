require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const adminRoutes = require('./routes/admin');
const db = require('./models');

app.use(bodyParser.json());

// Auth middleware
app.use((req, res, next) => {
    const token = req.headers['authorization'];
    if (token !== `Bearer ${process.env.ADMIN_TOKEN}`) {
        return res.status(403).json({ error: 'Forbidden - Invalid token' });
    }
    next();
});

app.use('/api/v1/admin', adminRoutes);

const PORT = process.env.PORT || 4000;

db.sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Admin Service running on port ${PORT}`);
    });
});
