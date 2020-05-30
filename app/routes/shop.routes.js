module.exports = (app) => {
    const shop = require('../controllers/shop.controller.js');

    var router = require('express').Router();

    // Retrieve all premium skins of a user
    router.get('/skins/premium/:id', shop.findPremium);

    // POST request to buy premium skin
    router.post('/skins/premium/:id', shop.buyPremium)

    // Retrieve all free skins of a user
    router.get('/skins/free/:id', shop.findFree);

    // POST request to add a skin
    router.post('/skins/:id', shop.addSkin)

    // Retrieve all level skins of a user
    router.get('/skins/level/:id', shop.findLevel);

    // Retrieve all skins from a user
    router.get('/skins/owned/:id', shop.findOwned);

    // Retrieve all skins from a user
    router.get('/skins/owned/:id', shop.findOwned);

    // Retrieve all boost plans
    router.get('/boosts', shop.getBoostPlans);

    // Retrieve all active boosts from a user
    router.get('/boosts/:id', shop.getActiveBoosts);

    // // Buy a Boost
    // router.post('/boosts/:id', shop.buyBoost);

    app.use('/api/v1/shop', router);
};
