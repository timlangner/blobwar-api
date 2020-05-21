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
            Word: {
                type: Sequelize.STRING,
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

    return BadWord;
};
