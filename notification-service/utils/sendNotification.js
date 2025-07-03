// notification-service/utils/sendNotification.js
function sendNotification(userId, message) {
    console.log(`📨 Notify user ${userId}: ${message}`);
    // later: send via email, websocket, push, etc.
}

module.exports = sendNotification;
