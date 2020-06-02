const fs = require('fs');
const path = require('path');
const WebSocket = require("ws");

let servers = {};

function checkServers() {
    return new Promise(async (resolve, reject) => {
        const keys = Object.keys(servers);

        for (let i = 0; i < keys.length; i++) {
            if (!servers[keys[i]].length) {
                delete servers[keys[i]]
            }

            if (servers[keys[i]] == undefined)
                return reject();

            servers[keys[i]].forEach((serv, index) => {
                if (serv.server.shutdown) {
                    servers[keys[i]].splice(index, 1)
                    if (!servers[keys[i]].length) {
                        delete servers[keys[i]]
                    }
                }
            })
        }
        resolve()
    })
}

exports.getServers = (req, res) => {
    const keys = Object.keys(servers);

    if (keys.length) {
        checkServers().then(() => {

            for (let i = 0; i < keys.length; i++) {
                servers[keys[i]].sort((a, b) => {
                    return a.server.port - b.server.port;
                })
            }

            res.send(servers)
        }).catch(() => {
            res.send(servers);
        })
    } else {
        res.send(servers);
    }
}

exports.saveServer = (req, res) => {
    let server = req.body[0];
    const gamemode = server.server.gamemode;
    delete server.server.gamemode;
    if (!servers[gamemode]) {
        servers[gamemode] = [server];
    } else {
        const keys = Object.keys(servers);
        for (let i = 0; i < keys.length; i++) {

            let found = false;

            for (let j in servers[gamemode]) {
                if (servers[gamemode][j].server.port == server.server.port) {
                    servers[gamemode][j] = server;
                    found = true;
                    break;
                }
            }

            if (!found) {
                servers[gamemode].push(server)
            }
        }
    }
}