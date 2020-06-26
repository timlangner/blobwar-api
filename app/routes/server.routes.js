module.exports = (app) => {
    const server = require('../controllers/server.controller.js');

    var router = require('express').Router();

    // Get all servers
    router.get('/', server.getServers);

    // Save/update server
    router.post('/:port', server.saveServer);

    // Delete server
    router.delete('/:port', server.deleteServer)

    app.use('/api/v2/servers', router);
};
