module.exports = (sequelize, Sequelize) => {
    const BadWord = sequelize.define(
        'BadWord',
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
            }
        },
        {
            defaultScope: {
                attributes: { exclude: ['createdAt', 'updatedAt'] },
            },
            freezeTableName: true,
            timestamps: false,
        },
    );

    return BadWord;
};
