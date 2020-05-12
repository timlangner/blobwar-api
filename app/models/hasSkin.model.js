module.exports = (sequelize, Sequelize) => {
    const HasSkin = sequelize.define(
        'HasSkin',
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
                references: { model: 'user', key: 'Id' },
            },
            SkinId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: 'skin', key: 'Id' },
            },
            CreationTime: {
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

    return HasSkin;
};
