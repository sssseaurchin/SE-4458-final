module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Job', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        city: {
            type: DataTypes.STRING,
            allowNull: false
        },
        country: {
            type: DataTypes.STRING,
            allowNull: false
        },
        working_type: {
            type: DataTypes.ENUM('fulltime', 'parttime', 'remote'),
            allowNull: false
        },
        company_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        application_count: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        }
    });
};
