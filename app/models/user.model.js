module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define('users', {
        Name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        Email: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        Coins: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 50,
        },
        Level: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 10,
        },
        Xp: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        Color: {
            type: Sequelize.STRING,
        },
        HasColor: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        HasRainbow: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        Role: {
            type: Sequelize.STRING,
        },
        IsChatBanned: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
    });

    return User;
};
