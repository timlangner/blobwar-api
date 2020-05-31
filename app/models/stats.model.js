module.exports = (sequelize, Sequelize) => {
    const Stats = sequelize.define(
        'Stats',
        {
            Id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            UserId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: 'User', key: 'Id' },
            },
            Kills: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            Deaths: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0,
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

    return Stats;
};
