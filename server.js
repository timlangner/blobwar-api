const express = require('express');
const expressip = require('express-ip');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./app/models');

const app = express();
db.sequelize.sync();

var corsOptions = {
    origin: 'http://127.0.0.1:8080',
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware for ipInfo
app.use(expressip().getIpInfoMiddleware);

// listen for routes
require('./app/routes/user.routes')(app);
require('./app/routes/login.routes')(app);
require('./app/routes/server.routes')(app);
require('./app/routes/shop.routes')(app);
require('./app/routes/others.routes')(app);

// set port, listen for requests
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
