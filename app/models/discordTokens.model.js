module.exports = (sequelize, Sequelize) => {
    const DiscordTokens = sequelize.define(
        'DiscordTokens',
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
            access_token: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            refresh_token: {
                type: Sequelize.STRING,
                allowNull: false,
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

    return DiscordTokens;
};
