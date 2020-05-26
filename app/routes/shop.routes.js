module.exports = (app) => {
    const shop = require('../controllers/shop.controller.js');

    var router = require('express').Router();

    // Retrieve all premium skins
    router.get('/skins/premium/:id', shop.findPremium);

    // POST request to buy premium skin
    // router.post('/skins/premium/:id', shop.buyPremium)

    // Retrieve all free skins
    router.get('/skins/free/:id', shop.findFree);

    // POST request to claim free skin
    // router.post('/skins/free/:id', shop.claimFree)

    // Retrieve all level skins
    router.get('/skins/level/:id', shop.findLevel);

    // POST request to claim level skin
    // router.post('/skins/level/:id', shop.claimLevel)

    // Retrieve all skins from a user
    router.get('/skins/owned/:id', shop.findOwned);

    app.use('/api/v1/shop', router);
};
