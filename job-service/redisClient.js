// job-service/redisClient.js
const redis = require('redis');

const client = redis.createClient({
    url: 'redis://172.29.201.186:6379'
});

client.on('error', (err) => console.error('Redis Client Error', err));

client.connect().then(() => {
    console.log('Connected to Redis');
});

module.exports = client;
