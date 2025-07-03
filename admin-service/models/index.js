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
db.Admin = require('./admin')(sequelize, Sequelize);

module.exports = db;
