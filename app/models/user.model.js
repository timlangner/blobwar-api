module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define(
        'User',
        {
            Id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            Username: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            DiscordUserId: {
                type: Sequelize.BIGINT,
                allowNull: false,
            },
            Email: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            SessionId: {
                type: Sequelize.STRING,
            },
            IpAddress: {
                type: Sequelize.STRING,
            },
            Coins: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 50,
            },
            Xp: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            Color: {
                type: Sequelize.STRING,
            },
            Role: {
                type: Sequelize.STRING,
                allowNull: false,
                defaultValue: 'Guest',
            },
            Muted: {
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

    return User;
};
