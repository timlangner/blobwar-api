const db = require('../models');
const Skin = db.skin;
const HasSkin = db.hasSkin;
const User = db.user;
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

// Find a single User with an id
exports.findSkins = (req, res) => {
    const id = req.params.id;

    Skin.hasMany(HasSkin, {
        foreignKey: 'SkinId',
    });
    HasSkin.belongsTo(User, { foreignKey: 'UserId' });
    HasSkin.belongsTo(Skin, { foreignKey: 'SkinId' });
    Skin.findAll({ where: { UserId: 4 }, include: [User, HasSkin]})
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send({
                message: 'Error retrieving all Skins from User with id=' + id,
            });
        });
};