const db = require('../models');
const Skin = db.skin;
const Op = db.Sequelize.Op;

// Retrieve all Skins from the database.
exports.findAll = (req, res) => {
    Skin.findAll()
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message:
                    err.message ||
                    'Some error occurred while retrieving all skins.',
            });
        });
};