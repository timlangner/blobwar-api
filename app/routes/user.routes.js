module.exports = (app) => {
    const user = require('../controllers/user.controller.js');
    const jwt = require('express-jwt');
    const jwksRsa = require('jwks-rsa');

    var router = require('express').Router();

    // Authorization Middleware init
    const checkJwt = jwt({
        secret: jwksRsa.expressJwtSecret({
            cache: true,
            rateLimit: true,
            jwksRequestsPerMinute: 5,
            jwksUri: `https://dev-vlkok0uj.eu.auth0.com/.well-known/jwks.json`,
        }),

        // Validate the audience and the issuer.
        audience: 'https:/blobwar.io/api/v1/',
        issuer: `https://dev-vlkok0uj.eu.auth0.com/`,
        algorithms: ['RS256'],
    });

    // Create a new User
    router.post('/', user.create);

    // Get user by sessionId and Ip for auto login
    router.post('/session', user.getUserBySessionIdAndIp);

    // Get user by sessionId for gameserver
    router.post('/get', user.getUserBySessionId);

    // Retrieve the top 100 users with the most xp
    router.get('/leaderboard', user.getLeaderBoard);

    // Check for Authorization for below routes
    // router.use(checkJwt);

    // Retrieve all Users
    router.get('/', user.findAll);

    // Retrieve a single User with id
    router.get('/:id', user.findOne);

    router.get('/:discordId', user.findOneByDiscordId);

    app.use('/api/v1/users', router);
};
