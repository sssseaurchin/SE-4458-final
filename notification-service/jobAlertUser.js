// notification-service/jobAlertUser.js
const redis = require('./redisClient');
const sendNotification = require('./utils/sendNotification');
const { connectRabbitMQ, publishJobAlert } = require('./rabbitmqClient');
const axios = require('axios');
console.log('Job Alert Worker Started');

async function runJobAlertTask() {
    console.log('Running job alert task...');

    try {
        const keys = await redis.keys('job_alerts:*');
        console.log('Found alert keys:', keys);

        if (keys.length === 0) {
            console.log('No job alert keys in Redis!');
            return;
        }

        // const keys = await redis.keys('job_alerts:*');

        for (const key of keys) {
            const userId = key.split(':')[1];
            const alertsJSON = await redis.get(key);
            const alerts = JSON.parse(alertsJSON);

            for (const alert of alerts) {
                const params = new URLSearchParams();
                if (alert.city) params.append('city', alert.city);
                if (alert.country) params.append('country', alert.country);
                if (alert.keywords?.length > 0) {
                    alert.keywords.forEach(kw => params.append('title', kw));
                }
                console.log(`Checking jobs for alert: ${params.toString()}`);

                const res = await axios.get(`http://localhost:3002/api/v1/jobs?${params.toString()}`);
                const jobs = res.data.data;

                if (jobs.length > 0) {
                    sendNotification(userId, `${jobs.length} new jobs matched your alert!`);
                    publishJobAlert({
                        userId,
                        alert,
                        matchedJobs: jobs.map(j => j.title),
                        timestamp: new Date().toISOString()
                    });
                }
            }
        }
    } catch (err) {
        console.error('Error in job alert task:', err);
    }
}

(async () => {
    await connectRabbitMQ();
    console.log('🔁 Starting periodic job alert task...');
    setInterval(runJobAlertTask, 5000); // REVERT BACK TO 60 SECONDS LATER
})();

module.exports = runJobAlertTask;
