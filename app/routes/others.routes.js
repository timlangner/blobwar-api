module.exports = (app) => {
    const BadWord = require('../controllers/badWord.controller.js');
    const user = require('../controllers/user.controller.js');
    const recaptcha = require('../controllers/recaptcha.controller.js');

    var router = require('express').Router();

    // Get bad words
    router.get('/badwords', BadWord.findAll);

    // log out user
    router.put('/logout', user.logout);

    // Recaptcha
    router.post('/recaptcha', recaptcha.verify)

    // Check if user is already logged in
    router.get('/ping/:id', user.checkUser)

    // Remove user from login history on refresh
    router.delete('/ping/:id', user.refreshLoginHistory);

    app.use('/api/v1', router);
};
