// seed.js
const db = require('./models');

async function seedJobs() {
    await db.sequelize.sync({ force: true }); // DANGER: resets DB

    await db.Job.bulkCreate([
        { title: "Frontend Developer", description: "React expert needed for dynamic UI tasks.", city: "Istanbul", country: "Turkey", working_type: "fulltime", company_name: "TechBridge" },
        { title: "Backend Engineer", description: "Node.js + Express backend services.", city: "Izmir", country: "Turkey", working_type: "remote", company_name: "CodeCraft" },
        { title: "Full Stack Developer", description: "React + Node full stack experience required.", city: "Ankara", country: "Turkey", working_type: "hybrid", company_name: "Softwave" },
        { title: "Mobile Developer", description: "Flutter app development across platforms.", city: "Antalya", country: "Turkey", working_type: "remote", company_name: "AppNova" },
        { title: "Data Scientist", description: "Python and ML models, pandas, scikit-learn.", city: "Bursa", country: "Turkey", working_type: "fulltime", company_name: "DataFolk" },
        { title: "DevOps Engineer", description: "Docker, CI/CD pipelines, AWS deployment.", city: "Istanbul", country: "Turkey", working_type: "hybrid", company_name: "DeployNow" },
        { title: "UI/UX Designer", description: "Figma + user research background.", city: "Izmir", country: "Turkey", working_type: "remote", company_name: "DesignNest" },
        { title: "QA Engineer", description: "Automated test writing with Cypress.", city: "Eskisehir", country: "Turkey", working_type: "fulltime", company_name: "BugBusters" },
        { title: "Product Manager", description: "Agile PM with SaaS product experience.", city: "Gaziantep", country: "Turkey", working_type: "hybrid", company_name: "Visionary" },
        { title: "Game Developer", description: "Unity 2D/3D experience, mobile games.", city: "Konya", country: "Turkey", working_type: "fulltime", company_name: "PixelPioneer" },
        { title: "Machine Learning Engineer", description: "Model deployment and optimization.", city: "Trabzon", country: "Turkey", working_type: "remote", company_name: "NeuroTech" },
        { title: "Cybersecurity Analyst", description: "Threat modeling, audits, and pentesting.", city: "Kayseri", country: "Turkey", working_type: "remote", company_name: "SecureLayer" },
        { title: "Database Administrator", description: "PostgreSQL and performance tuning.", city: "Samsun", country: "Turkey", working_type: "fulltime", company_name: "DataCore" },
        { title: "System Administrator", description: "Linux systems and on-prem servers.", city: "Istanbul", country: "Turkey", working_type: "hybrid", company_name: "InfraWave" },
        { title: "Tech Support Specialist", description: "Tier 2 tech support for clients.", city: "Adana", country: "Turkey", working_type: "fulltime", company_name: "HelpHub" },
        { title: "AI Researcher", description: "NLP models and LLM tuning.", city: "Izmir", country: "Turkey", working_type: "remote", company_name: "BrainBoost" },
        { title: "Cloud Engineer", description: "GCP/Azure experience preferred.", city: "Ankara", country: "Turkey", working_type: "fulltime", company_name: "SkyStack" },
        { title: "Technical Writer", description: "API docs and developer guides.", city: "Mersin", country: "Turkey", working_type: "remote", company_name: "DocForge" },
        { title: "IT Project Coordinator", description: "SCRUM ceremonies and sprints.", city: "Diyarbakir", country: "Turkey", working_type: "hybrid", company_name: "TeamSync" },
        { title: "Intern - Software Engineering", description: "Part-time internship for CS students.", city: "Istanbul", country: "Turkey", working_type: "parttime", company_name: "BrightStart" }
    ]);

    console.log("Jobs seeded successfully.");
    process.exit();
}

seedJobs();
