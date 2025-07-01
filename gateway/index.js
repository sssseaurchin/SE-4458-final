const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Proxies
app.use('/api/v1/auth', createProxyMiddleware({
    target: 'http://localhost:5000',
    changeOrigin: true,
}));

app.use('/api/v1/jobs', createProxyMiddleware({
    target: 'http://localhost:3001',
    changeOrigin: true,
}));

app.use('/api/v1/admin', createProxyMiddleware({
    target: 'http://localhost:4000',
    changeOrigin: true,
}));

app.get('/', (req, res) => {
    res.send('API Gateway running!');
});

const PORT = 3002;
app.listen(PORT, () => {
    console.log(`Gateway listening on http://localhost:${PORT}`);
});
