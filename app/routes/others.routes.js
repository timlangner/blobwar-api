module.exports = (app) => {
    const BadWord = require('../controllers/badWord.controller.js');
    const user = require('../controllers/user.controller.js');

    var router = require('express').Router();

    // Get nad words
    router.get('/badwords', BadWord.findAll);

    // Get nad words
    router.put('/logout', user.logout);

    app.use('/api/v1', router);
};
