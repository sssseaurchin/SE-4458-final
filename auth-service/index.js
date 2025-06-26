// auth-service/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const db = require('./models');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/api/v1/auth', authRoutes);

const PORT = process.env.PORT || 5000;

db.sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Auth Service running on port ${PORT}`);
    });
});
