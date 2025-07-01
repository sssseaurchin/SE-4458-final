require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const db = require('./models');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/', authRoutes);

app.get('/health', (req, res) => res.send('Auth service is healthy'));

const PORT = process.env.PORT || 5000;

db.sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Auth Service running on port ${PORT}`);
    });
}).catch(err => {
    console.error('Failed to sync Auth DB:', err);
});
