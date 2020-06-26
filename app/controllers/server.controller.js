let servers = {};

exports.getServers = (req, res) => {
    if (!Object.keys(servers).length) {
        res.status(204).send({
            message: `No servers found`,
        });
    } else {
        res.send(servers);
    }
}

exports.saveServer = (req, res) => {
    const port = req.params.port;
    const body = req.body;

    servers[port] = body;
}

exports.deleteServer = (req, res) => {
    const port = req.params.port;

    if (!servers[port]) {
        res.status(204).send({
            message: `No server found with port: ${port}`
        });
    } else {
        delete servers[port];
    }
}