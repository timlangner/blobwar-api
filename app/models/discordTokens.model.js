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
            access_token: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            refresh_token: {
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

    return DiscordTokens;
};
