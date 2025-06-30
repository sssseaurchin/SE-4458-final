// admin-service/index.js
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const adminRoutes = require('./routes/admin');
// const requireAdminToken = require('./middleware/requireAdminToken');

app.use(cors());
app.use(bodyParser.json());

app.use('/api/v1/admin/login', adminRoutes);

app.use('/api/v1/admin', adminRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Admin Service running on port ${PORT}`);
});
