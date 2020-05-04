module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define('user', {
        name: {
            type: Sequelize.STRING,
        },
        email: {
            type: Sequelize.STRING,
        },
        ip_address: {
            type: Sequelize.STRING,
        },
        coins: {
            type: Sequelize.INTEGER,
            defaultValue: 50,
        },
        level: {
            type: Sequelize.INTEGER,
            defaultValue: 10,
        },
        xp: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
        },
        pwd: {
            type: Sequelize.BLOB,
        },
        color: {
            type: Sequelize.STRING,
        },
        hat: {
            type: Sequelize.STRING,
        },
        session_id: {
            type: Sequelize.STRING,
        },
        hascolor: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
        },
        hasrainbow: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
        },
        oldcolor: {
            type: Sequelize.STRING,
        },
        tierpoints: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
        },
        tierlevel: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
        },
        role: {
            type: Sequelize.STRING,
            defaultValue: 'Guest',
        },
        chat_ban: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
        },
        noads: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
        },
        referral_count: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
        },
    });

    return User;
};
