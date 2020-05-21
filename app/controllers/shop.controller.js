const db = require('../models');
const Skin = db.skin;
const HasSkin = db.hasSkin;
const User = db.user;
const Op = db.Sequelize.Op;

// Retrieve all premium Skins from the database.
exports.findPremium = (req, res) => {

    Skin.hasMany(HasSkin);
    Skin.hasMany(User);
    HasSkin.belongsTo(User, { targetKey: 'Id', foreignKey: 'UserId' });
    HasSkin.belongsTo(Skin, { targetKey: 'Id', foreignKey: 'SkinId' });
    Skin.findAll({
        attributes: ['Id'],
        include: [
            {
                model: HasSkin,
                attributes: [],
                where: { UserId: req.body.UserId },
                required: true,
            },
        ],
    })
        .then((ownedUserSkins) => {
            console.log('ownedUserSkins');
            console.log(ownedUserSkins[0].dataValues.Id);    
            
            Skin.findAll({
                attributes: ['Id', 'Price', 'Name', 'Xp'],
                where: {
                    Price: {
                        [Op.gt]: 0,
                    },
                    Private: 0,
                    Xp: 0,
                    [Op.not]: [{ Id: [ownedUserSkins[0].dataValues.Id] }],
                },
            })
                .then((premiumSkins => {
            console.log(premiumSkins); 
                    
                    res.send(premiumSkins);
                }));
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send({
                message:
                    'Error retrieving all premium skins for User with the Id ' +
                    req.body.UserId,
            });
        });
};

// Retrieve all free Skins from the database.
exports.findFree = (req, res) => {
    Skin.findAll({
        where: { Price: 0, Xp: 0, Private: 0 }
    })
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

// Retrieve all level Skins from the database.
exports.findLevel = (req, res) => {
    Skin.findAll({
        where: {
            Xp: {
                [Op.gt]: 0,
            },
            Private: 0
        },
    })
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
exports.findOwned = (req, res) => {
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
                where: { UserId: req.params.id },
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
                message:
                    'Error retrieving all Skins from User with id=' +
                    req.body.UserId,
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