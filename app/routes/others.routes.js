module.exports = (app) => {
    const BadWord = require('../controllers/badWord.controller.js');

    var router = require('express').Router();

    // Get nad words
    router.get('/badwords', BadWord.findAll);

    app.use('/api/v1', router);
};
