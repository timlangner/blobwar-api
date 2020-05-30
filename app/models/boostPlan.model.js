module.exports = (sequelize, Sequelize) => {
    const BoostPlan = sequelize.define(
        'BoostPlan',
        {
            Id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            Type: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            Price: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            Duration: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
        },
        {
            defaultScope: {
                attributes: { exclude: ['createdAt', 'updatedAt'] },
            },
            freezeTableName: true,
            timestamps: false,
        },
    );

    return BoostPlan;
};
