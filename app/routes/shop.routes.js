module.exports = (app) => {
    const shop = require('../controllers/shop.controller.js');

    var router = require('express').Router();

    // Retrieve all premium skins
    router.get('/skins/premium/:id', shop.findPremium);

    // Retrieve all free skins
    router.get('/skins/free/:id', shop.findFree);

    // Retrieve all level skins
    router.get('/skins/level/:id', shop.findLevel);

    // Retrieve all skins from a user
    router.get('/skins/owned/:id', shop.findOwned);

    app.use('/api/v1/shop', router);
};
