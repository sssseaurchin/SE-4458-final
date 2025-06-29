// admin-service/models/admin.js
module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Admin', {
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });
};
