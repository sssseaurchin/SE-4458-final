require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const jobRoutes = require('./routes/jobs');
const db = require('./models');

app.use(bodyParser.json());
app.use('/api/v1/jobs', jobRoutes);

const PORT = process.env.PORT || 3001;

db.sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Job Service is running on port ${PORT}`);
    });
});
