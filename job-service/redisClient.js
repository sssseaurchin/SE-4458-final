// job-service/redisClient.js
const redis = require('redis');

const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

const client = redis.createClient({
  url: redisUrl,
});

client.on('error', (err) => console.error('Redis Client Error', err));

client.connect().then(() => {
    console.log('Connected to Redis');
});

module.exports = client;
