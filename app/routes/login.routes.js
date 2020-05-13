module.exports = (app) => {
    const login = require('../controllers/login.controller.js');

    var router = require('express').Router();

    // Get discord user
    router.post('/', login.authDiscord);

    app.use('/api/v1/auth/discord', router);
};
