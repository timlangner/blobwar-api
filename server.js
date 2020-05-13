const express = require('express');
const cors = require('cors');
const db = require('./app/models');

const app = express();
db.sequelize.sync();

var corsOptions = {
    origin: 'http://localhost:8081',
};

app.use(cors(corsOptions));

// listen for routes
require('./app/routes/user.routes')(app);
require('./app/routes/skin.routes')(app);
require('./app/routes/login.routes')(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
