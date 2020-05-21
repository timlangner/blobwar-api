const db = require('../models');
const BadWord = db.badWord;
const Sequelize = db.Sequelize;

// Retrieve all bad words from the database.
exports.findAll = (req, res) => {
    BadWord.findAll()
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message:
                    err.message ||
                    'Some error occurred while retrieving all bad words.',
            });
        });
};