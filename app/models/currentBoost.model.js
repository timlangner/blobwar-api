module.exports = (sequelize, Sequelize) => {
    const CurrentBoost = sequelize.define(
        'CurrentBoost',
        {
            Id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            UserId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: 'User', key: 'Id' },
            },
            BoostPlanId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: 'BoostPlan', key: 'Id' },
            },
            CreationTime: {
                type: Sequelize.INTEGER,
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

    return CurrentBoost;
};
