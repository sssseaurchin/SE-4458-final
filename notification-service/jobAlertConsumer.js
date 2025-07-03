// notification-service/jobAlertConsumer.js
const amqp = require('amqplib');

const queue = 'job_alerts_queue';

(async () => {
    try {
        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();

        await channel.assertQueue(queue, { durable: true });
        console.log('Waiting for messages in', queue);
        channel.consume(queue, msg => {
            if (msg !== null) {
                const data = JSON.parse(msg.content.toString());
                console.log('Received job alert message:', data);
                channel.ack(msg);
            }
        });
    } catch (err) {
        console.error('Error in consumer:', err);
    }
})();
