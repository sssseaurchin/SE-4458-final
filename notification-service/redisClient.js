// notification-service/redisClient.js

const redis = require('redis');

const client = redis.createClient({
    url: process.env.REDIS_URL || 'redis://172.29.201.186:6379'
});

client.connect().catch(console.error);

module.exports = client;
