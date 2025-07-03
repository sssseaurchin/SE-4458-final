// notification-service/rabbitmqClient.js
const amqp = require('amqplib');

let channel;

async function connectRabbitMQ() {
    try {
        const connection = await amqp.connect('amqp://localhost');
        channel = await connection.createChannel();
        await channel.assertQueue('job_alerts_queue');
        console.log('Connected to RabbitMQ');
    } catch (error) {
        console.error('RabbitMQ connection error:', error);
    }
}

function publishJobAlert(message) {
    if (!channel) return console.error('RabbitMQ channel not ready.');
    channel.sendToQueue('job_alerts_queue', Buffer.from(JSON.stringify(message)));
    console.log(`Publishing to queue:`, message); // DEBUG
}

module.exports = {
    connectRabbitMQ,
    publishJobAlert
};
