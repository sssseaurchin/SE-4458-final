// admin-service/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const adminRoutes = require('./routes/admin');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/', adminRoutes);

app.get('/health', (req, res) => res.send('Admin service is healthy'));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`✅ Admin Service running on port ${PORT}`);
});
