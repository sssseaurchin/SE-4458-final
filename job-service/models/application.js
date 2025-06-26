module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Application', {
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        job_id: {
            type: DataTypes.UUID,
            allowNull: false
        },
        applied_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    });
};
