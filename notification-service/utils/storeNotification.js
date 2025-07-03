// notification-service/utils/storeNotification.js
const redis = require('../redisClient');

async function storeNotification(userId, messageObj) {
    const key = `user_notifications:${userId}`;
    const maxNotifications = 50; // Keep only the latest 50

    try {
        await redis.lPush(key, JSON.stringify(messageObj));
        await redis.lTrim(key, 0, maxNotifications - 1);
        console.log(`Stored notification for user ${userId}`);
    } catch (err) {
        console.error('Failed to store notification:', err);
    }
}

module.exports = storeNotification;
