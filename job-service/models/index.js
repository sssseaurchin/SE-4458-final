// job-service/models/index.js
const { Sequelize } = require('sequelize');
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: '../job-service/jobs.sqlite',
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
