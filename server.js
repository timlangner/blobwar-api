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

var corsOptions = {
    origin: '*',
    // origin: 'http://localhost:8081',
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
require('./app/routes/others.routes')(app);

let httpsServer = http.createServer(app);
// let httpsServer = http.createServer(app);

// set port, listen for requests
const PORT = process.env.PORT || 8081;
httpsServer.listen(PORT)
