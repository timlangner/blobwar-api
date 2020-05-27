const db = require('../models');
const Skin = db.skin;
const HasSkin = db.hasSkin;
const User = db.user;
const Op = db.Sequelize.Op;

// Define references
Skin.hasOne(HasSkin);
HasSkin.belongsTo(User);
HasSkin.belongsTo(Skin);

// Retrieve all premium Skins from the database.
exports.findPremium = (req, res) => {
    Skin.findAll({
        attributes: ['Id'],
        include: [
            {
                model: HasSkin,
                attributes: [],
                where: { UserId: req.params.id },
                required: true,
            },
        ],
    })
        .then((ownedUserSkins) => {
            const premiumSkinIds = [];
            ownedUserSkins.forEach((id) => {
                premiumSkinIds.push(id.dataValues.Id);
            });
            if (premiumSkinIds && premiumSkinIds.length > 0) {
                Skin.findAll({
                    attributes: ['Id', 'Price', 'Name', 'Xp'],
                    where: {
                        Price: {
                            [Op.gt]: 0,
                        },
                        Xp: 0,
                        Private: 0,
                        [Op.not]: [{ Id: { [Op.in]: premiumSkinIds } }],
                    },
                }).then((premiumSkins) => {
                    res.send(premiumSkins);
                });
            } else {
                res.status(204).send({
                    message: 'The user already owns all premium skins',
                });
            }
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send({
                message:
                    'Error retrieving all premium skins for User with the Id ' +
                    req.params.id,
            });
        });
};

// Retrieve all free Skins from the database.
exports.findFree = (req, res) => {
    Skin.findAll({
        attributes: ['Id'],
        include: [
            {
                model: HasSkin,
                attributes: [],
                where: { UserId: req.params.id },
                required: true,
            },
        ],
    })
        .then((ownedUserSkins) => {
            const freeSkinIds = [];
            ownedUserSkins.forEach((id) => {
                freeSkinIds.push(id.dataValues.Id);
            });
            if (freeSkinIds && freeSkinIds.length > 0) {
                Skin.findAll({
                    attributes: ['Id', 'Price', 'Name', 'Xp'],
                    where: {
                        Price: 0,
                        Xp: 0,
                        Private: 0,
                        [Op.not]: [{ Id: { [Op.in]: freeSkinIds } }],
                    },
                }).then((freeSkins) => {
                    res.send(freeSkins);
                });
            } else {
                res.status(204).send({
                    message: 'The user already owns all free skins',
                });
            }
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send({
                message:
                    'Error retrieving all free skins for User with the Id ' +
                    req.params.id,
            });
        });
};

// Retrieve all level Skins from the database.
exports.findLevel = (req, res) => {
    Skin.findAll({
        attributes: ['Id'],
        include: [
            {
                model: HasSkin,
                attributes: [],
                where: { UserId: req.params.id },
                required: true,
            },
        ],
    })
        .then((ownedUserSkins) => {
            const levelSkinIds = [];
            ownedUserSkins.forEach((id) => {
                levelSkinIds.push(id.dataValues.Id);
            });
            if (levelSkinIds && levelSkinIds.length > 0) {
                Skin.findAll({
                    attributes: ['Id', 'Price', 'Name', 'Xp'],
                    where: {
                        Price: 0,
                        Xp: {
                            [Op.gt]: 0,
                        },
                        Private: 0,
                        [Op.not]: [{ Id: { [Op.in]: levelSkinIds } }],
                    },
                }).then((levelSkins) => {
                    res.send(levelSkins);
                });
            } else {
                res.status(204).send({
                    message: 'The user already owns all level skins',
                });
            }
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send({
                message:
                    'Error retrieving all level skins for User with the Id ' +
                    req.params.id,
            });
        });
};

// Find all skins of a user
exports.findOwned = (req, res) => {
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

    let skinName = '';

    Skin.findOne({
        attributes: ['Id', 'Name', 'Xp'],
        where: { Id: req.body.SkinId },
    }).then((skin) => {
        skinName = skin.dataValues.Name;
        if (JSON.parse(skin.dataValues.Xp > 0)) {
            User.findOne({
                attributes: ['Xp'],
                where: { Id: req.params.id },
            }).then((user) => {
                console.log(JSON.parse(user.dataValues.Xp));
                console.log(
                    JSON.parse(user.dataValues.Xp) >=
                        JSON.parse(skin.dataValues.Xp),
                );
                if (
                    JSON.parse(user.dataValues.Xp) >=
                    JSON.parse(skin.dataValues.Xp)
                ) {
                    HasSkin.create({
                        UserId: parseInt(req.params.id),
                        SkinId: req.body.SkinId,
                    })
                        .then((createdSkin) => {
                            res.status(200).send({
                                message: `You have successfully claimed the ${skinName} skin`,
                            });
                        })
                        .catch((err) => {
                            console.log(err);
                            res.status(500).send({
                                message: `Some error occured while adding the ${skinName} skin`,
                            });
                        });
                } else {
                    res.status(409).send({
                        message: `You do not have enough XP to claim the ${skinName} skin`,
                    });
                }
            });
        } else {
            HasSkin.create({
                UserId: parseInt(req.params.id),
                SkinId: req.body.SkinId,
            })
                .then((createdSkin) => {
                    res.status(200).send({
                        message: `You have successfully claimed the ${skinName} skin`,
                    });
                })
                .catch((err) => {
                    console.log(err);
                    res.status(500).send({
                        message: `Some error occured while adding the ${skinName} skin`,
                    });
                });
        }
    });
};

// Add's a skin to a user & update users coins
exports.buyPremium = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: 'Content can not be empty!',
        });
        return;
    }

    let skinName = '';

    // Get the skin the user wants to buy
    Skin.findOne({
        attributes: ['Id', 'Name', 'Price'],
        where: { Id: req.body.SkinId },
    })
        .then((skin) => {
            skinName = skin.dataValues.Name;
            if (skin) {
                // Check if user has enough coins to buy the skin
                User.findOne({
                    attributes: ['Coins'],
                    where: { Id: req.params.id },
                })
                    .then((coins) => {
                        if (
                            JSON.parse(coins.dataValues.Coins) <
                            JSON.parse(skin.dataValues.Price)
                        ) {
                            res.status(409).send({
                                message: `You do not have enough coins to purchase the ${skinName} skin`,
                            });
                        } else {
                            // Adds skin to user
                            HasSkin.create({
                                UserId: parseInt(req.params.id),
                                SkinId: req.body.SkinId,
                            }).then((addedSkin) => {
                                // Update users coins
                                User.update(
                                    {
                                        Coins: db.Sequelize.literal(
                                            `Coins - ${JSON.parse(
                                                skin.dataValues.Price,
                                            )}`,
                                        ),
                                    },
                                    {
                                        where: {
                                            Id: req.params.id,
                                        },
                                    },
                                )
                                    .then(() => {
                                        res.status(200).send({
                                            message: `You have successfully purchased the ${skinName} skin`,
                                        });
                                    })
                                    .catch((err) => {
                                        res.status(500).send({
                                            message:
                                                err.message ||
                                                'Some error occurd while trying to update users coins.',
                                        });
                                    });
                            });
                        }
                    })
                    .catch((err) => {
                        res.status(500).send({
                            message:
                                'Error retrieving User with id=' +
                                req.params.id,
                        });
                    });
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: 'Error retrieving skin with id=' + req.body.SkinId,
            });
        });
};
