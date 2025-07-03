// notification-service/utils/storeNotification.js
const redis = require('../redisClient');

async function storeNotification(userId, alert, matchedJobs) {
    const key = `user_notifications:${userId}`;
    const maxNotifications = 50;

    const messageObj = {
        userId,
        alert,
        matchedJobs: matchedJobs.map(j => ({
            id: j.id,
            title: j.title
        })),
        timestamp: new Date().toISOString()
    };

    try {
        await redis.LPUSH(key, JSON.stringify(messageObj));
        await redis.LTRIM(key, 0, maxNotifications - 1);
        console.log(`Stored notification for user ${userId}`);
    } catch (err) {
        console.error('Failed to store notification:', err);
    }
}

module.exports = storeNotification;
