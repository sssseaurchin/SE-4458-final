// job-service/models/index.js
const { Sequelize } = require('sequelize');
const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    logging: false
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Job = require('./job')(sequelize, Sequelize);
db.Application = require('./application')(sequelize, Sequelize);

db.Application.belongsTo(db.Job, { foreignKey: 'job_id', onDelete: 'CASCADE'});
db.Job.hasMany(db.Application, { foreignKey: 'job_id', onDelete: 'CASCADE'});

module.exports = db;
