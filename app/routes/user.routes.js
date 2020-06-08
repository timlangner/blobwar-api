module.exports = (app) => {
    const user = require('../controllers/user.controller.js');
    const jwt = require('express-jwt');
    const jwksRsa = require('jwks-rsa');

    var router = require('express').Router();

    // Create a new User
    router.post('/', user.create);

    // Get user by sessionId and Ip for auto login
    router.post('/session', user.getUserBySessionIdAndIp);

    // Get user by sessionId for gameserver
    router.post('/get', user.getUserBySessionId);

    // Retrieve the top 100 users with the most xp
    router.get('/leaderboard/:page', user.getLeaderBoard);
    router.get('/leaderboard', user.getLeaderBoard);

    // Retrieve all Users
    router.get('/', user.findAll);

    // Retrieve a single User with id
    router.get('/:id', user.findOne);

    router.get('/:discordId', user.findOneByDiscordId);

    router.put('/coins/add/:discordId', user.updateCoins);

    router.put('/coins/set/:discordId', user.setCoins);

    app.use('/api/v1/users', router);
};
