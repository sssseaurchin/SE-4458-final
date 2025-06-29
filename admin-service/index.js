require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const adminRoutes = require('./routes/admin');
const db = require('./models');
const requireAdminToken = require('./middleware/requireAdminToken');

app.use(requireAdminToken);
app.use(cors());
app.use(bodyParser.json());

app.use('/api/v1/admin', adminRoutes);

const PORT = process.env.PORT || 4000;

db.sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Admin Service running on port ${PORT}`);
    });
});
