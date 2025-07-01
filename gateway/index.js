const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// Job service expects /api/v1/jobs inside its own routes
// rewrite the incoming /api/v1/jobs to / (empty string)
app.use('/api/v1/jobs', createProxyMiddleware({
    target: 'http://localhost:3001',
    changeOrigin: true,
    pathRewrite: { '^/api/v1/jobs': '' }, // ✅ this is crucial
    logLevel: 'debug'
}));

app.use('/api/v1/auth', createProxyMiddleware({
    target: 'http://localhost:5000',
    changeOrigin: true,
    pathRewrite: { '^/api/v1/auth': '' },
    logLevel: 'debug'
}));

app.use('/api/v1/admin', createProxyMiddleware({
    target: 'http://localhost:4000',
    changeOrigin: true,
    pathRewrite: { '^/api/v1/admin': '' },
    logLevel: 'debug'
}));

const PORT = 3002;
app.listen(PORT, () => {
    console.log('Gateway listening on http://localhost:3002');
});
