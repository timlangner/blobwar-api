const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./app/models');

const app = express();
db.sequelize.sync();

var corsOptions = {
    origin: 'http://localhost:8081',
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// listen for routes
require('./app/routes/user.routes')(app);
require('./app/routes/login.routes')(app);
require('./app/routes/token.routes')(app);
require('./app/routes/server.routes')(app);
require('./app/routes/shop.routes')(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
