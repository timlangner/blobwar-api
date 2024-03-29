const dbConfig = require('../config/db.config.js');
const Sequelize = require('sequelize');

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    operatorsAliases: false,

    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle,
    },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require('./user.model.js')(sequelize, Sequelize);
db.skin = require('./skin.model.js')(sequelize, Sequelize);
db.hasSkin = require('./hasSkin.model.js')(sequelize, Sequelize);
db.badWord = require('./badWord.model.js')(sequelize, Sequelize);
db.boostPlan = require('./boostPlan.model.js')(sequelize, Sequelize);
db.currentBoost = require('./currentBoost.model.js')(sequelize, Sequelize);

module.exports = db;
