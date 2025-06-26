// seed.js
const db = require('./models');

async function seedJobs() {
    await db.sequelize.sync({ force: true }); // DANGER: resets DB
    const jobs = await db.Job.bulkCreate([
        {
            title: "Frontend Developer",
            description: "We are looking for a React expert.",
            city: "Istanbul",
            country: "Turkey",
            working_type: "fulltime",
            company_name: "TechBridge"
        },
        {
            title: "Backend Engineer",
            description: "Node.js developer with API experience.",
            city: "Izmir",
            country: "Turkey",
            working_type: "remote",
            company_name: "CodeCraft"
        },
        {
            title: "Full Stack Developer",
            description: "React + Node full stack developer needed.",
            city: "Ankara",
            country: "Turkey",
            working_type: "fulltime",
            company_name: "Softwave"
        }
    ]);

    console.log("Jobs seeded successfully.");
    process.exit();
}

seedJobs();
