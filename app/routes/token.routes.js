module.exports = (app) => {
    const token = require('../controllers/token.controller.js');

    var router = require('express').Router();

    // Retrieve all Users
    router.post('/', token.findUser);

    app.use('/api/v1/token', router);
};
