module.exports = (sequelize, Sequelize) => {
    const Skin = sequelize.define(
        'Skin',
        {
            Id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            Price: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            Name: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            Xp: {
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

    return Skin;
};
