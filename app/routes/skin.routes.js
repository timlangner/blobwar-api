module.exports = (app) => {
    const skin = require('../controllers/skin.controller.js');

    var router = require('express').Router();

    // Retrieve all Users
    router.get('/', skin.findAll);

    router.post('/:id', skin.addSkin)

    app.use('/api/v1/skins', router);
};
