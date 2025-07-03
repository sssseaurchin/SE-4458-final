// notification-service/index.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => res.send('Notification Service is up'));

const PORT = process.env.PORT || 7000;
app.listen(PORT, () => {
    console.log(`Notification Service running on port ${PORT}`);
});
