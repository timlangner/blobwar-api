module.exports = (app) => {
    const user = require('../controllers/user.controller.js');

    var router = require('express').Router();

    // Get user by sessionId for gameserver
    router.post('/users/session', user.getUserBySessionId);

    // Check if user is already logged in
    router.get('/users/checkLogin/:sessionId', user.checkLogin)

    // Remove user from login history on refresh or logout
    router.delete('/users/checkLogin/:sessionId', user.refreshLogin);

    // Add coins to user
    router.put('/users/coins/:userId', user.addCoins);

    // Add xp to user
    router.put('/users/xp/:userId', user.addXp);

    app.use('/api/v1/gameserver', router);
};
