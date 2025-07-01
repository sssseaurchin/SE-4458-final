require('dotenv').config();
const express = require('express');
const app = express();
const jobRoutes = require('./routes/jobs');
const db = require('./models');

app.use(express.json());

app.use('/', jobRoutes); // All job routes
app.use('/api/v1/search-history', require('./routes/searchHistory'));

app.get('/health', (req, res) => res.send('Job service is healthy'));

const PORT = process.env.PORT || 3001;

db.sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Job Service is running on port ${PORT}`);
    });
}).catch(err => {
    console.error('Failed to sync DB:', err);
});
