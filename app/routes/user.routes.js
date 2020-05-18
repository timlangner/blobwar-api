module.exports = (app) => {
    const user = require('../controllers/user.controller.js');
    const skin = require('../controllers/shop.controller.js');
    const jwt = require('express-jwt');
    const jwksRsa = require('jwks-rsa');

    var router = require('express').Router();

    // // Authorization Middleware init
    // const checkJwt = jwt({
    //     secret: jwksRsa.expressJwtSecret({
    //         cache: true,
    //         rateLimit: true,
    //         jwksRequestsPerMinute: 5,
    //         jwksUri: `https://dev-vlkok0uj.eu.auth0.com/.well-known/jwks.json`,
    //     }),

    //     // Validate the audience and the issuer.
    //     audience: 'https:/blobwar.io/api/v1/',
    //     issuer: `https://dev-vlkok0uj.eu.auth0.com/`,
    //     algorithms: ['RS256'],
    // });

    // // Check for Authorization
    // router.use(checkJwt);

    // Retrieve all Users
    router.get('/', user.findAll);
    
    // Retrieve the top 100 users with the most xp
    router.get('/leaderboard', user.getLeaderBoard);

    // Retrieve a single User with id
    router.get('/:id', user.findOne);

    // Create a new User
    router.post('/', user.create);

    app.use('/api/v1/users', router);
};
