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

// Find all skins of a user
exports.findSkins = (req, res) => {
    const id = req.params.id;

    Skin.hasMany(HasSkin);
    Skin.hasMany(User);
    HasSkin.belongsTo(User, { targetKey: 'Id', foreignKey: 'UserId' });
    HasSkin.belongsTo(Skin, { targetKey: 'Id', foreignKey: 'SkinId' });
    Skin.findAll({
        attributes: ['Id', 'Name', 'Price'],
        include: [
            {
                model: HasSkin,
                attributes: [],
                where: { UserId: id },
                required: true,
            },
        ],
    })
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

// Add's a skin to a user
exports.addSkin = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: 'Content can not be empty!',
        });
        return;
    }

    HasSkin.create({
        UserId: parseInt(req.params.id),
        SkinId: req.body.skinId
    })
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send({
                message: 'Some error occurred while adding a skin to a user.',
            });
        });
};