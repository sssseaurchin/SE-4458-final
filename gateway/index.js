const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// Proxy: Job Service
app.use('/api/v1/jobs', createProxyMiddleware({
    target: process.env.JOB_SERVICE_URL || 'http://localhost:3001',
    changeOrigin: true,
    pathRewrite: { '^/api/v1/jobs': '' },
    logLevel: 'debug',
}));

// Proxy: Search History
app.use('/api/v1/search-history', createProxyMiddleware({
    target: process.env.JOB_SERVICE_URL || 'http://localhost:3001',
    changeOrigin: true,
    pathRewrite: { '^/api/v1/search-history': '/search-history' },
    logLevel: 'debug',
}));

// Proxy: Auth Service
app.use('/api/v1/auth', createProxyMiddleware({
    target: process.env.AUTH_SERVICE_URL || 'http://localhost:5000',
    changeOrigin: true,
    pathRewrite: { '^/api/v1/auth': '' },
    logLevel: 'debug',
}));

// Proxy: Notification Service
app.use('/api/v1/notifications', createProxyMiddleware({
    target: process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:7000',
    changeOrigin: true,
    pathRewrite: { '^/api/v1/notifications': '' },
    logLevel: 'debug',
}));

// Proxy: Admin Service
app.use('/api/v1/admin', createProxyMiddleware({
    target: process.env.ADMIN_SERVICE_URL || 'http://localhost:4000',
    changeOrigin: true,
    pathRewrite: { '^/api/v1/admin': '' },
    logLevel: 'debug',
}));

const PORT = 3002;
app.listen(PORT, () => {
    console.log('Gateway listening on http://localhost:3002');
});
