const express = require('express');
const requestIp = require('request-ip');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./app/models');
const https = require('https');
const http = require("http");
const fs = require("fs");
let privateKey = fs.readFileSync('ssl/privkey.pem', 'utf8');
let certificate = fs.readFileSync('ssl/fullchain.pem', 'utf8');
let credentials = { key: privateKey, cert: certificate };

const app = express();
db.sequelize.sync();

var whitelist = ['https://blobwar.io', 'https://admin.blobwar.io', 'http://localhost', 'http://localhost:8080']
var corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    }
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware for ipInfo
app.use(requestIp.mw());

// listen for routes
require('./app/routes/user.routes')(app);
require('./app/routes/login.routes')(app);
require('./app/routes/server.routes')(app);
require('./app/routes/shop.routes')(app);
require('./app/routes/gameserver.routes')(app);
require('./app/routes/others.routes')(app);

// let httpsServer = https.createServer(credentials, app);
let httpsServer = http.createServer(app);

// set port, listen for requests
const PORT = process.env.PORT || 8081;
httpsServer.listen(PORT)
