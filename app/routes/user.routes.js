module.exports = (app) => {
    const users = require('../controllers/user.controller.js');
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
    router.get('/', users.findAll);

    // Retrieve a single User with id
    router.get('/:id', users.findOne);

    // Create a new User
    router.post('/', users.create);

    app.use('/api/v1/users', router);
};
