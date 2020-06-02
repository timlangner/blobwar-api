module.exports = (app) => {
    const server = require('../controllers/server.controller.js');

    var router = require('express').Router();

    // Read the JSON Data
    router.get('/', server.getServers);

    // Create a JSON file with the server stats
    router.post('/', server.saveServer);

    app.use('/api/v1/servers', router);
};
