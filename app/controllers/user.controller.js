const db = require('../models');
const request = require('request');
const User = db.user;
const HasSkin = db.hasSkin;
const Sequelize = db.Sequelize;

// Logout
exports.logout = (req, res) => {
    const sessionId = req.body.SessionId;

    User.update(
        { SessionId: null, IpAddress: null },
        { where: { SessionId: sessionId, IpAddress: req.clientIp } },
    )
        .then(() => {
            res.send('logout');
        })
        .catch((err) => {
            res.status(500).send({
                message:
                    err.message || 'Some error occurd while trying to logout.',
            });
        });
};

// Retrieve all Users from the database.
exports.findAll = (req, res) => {
    User.findAll({
        attributes: {
            exclude: ['Email', 'SessionId', 'IpAddress'],
        },
    })
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message:
                    err.message ||
                    'Some error occurred while retrieving all users.',
            });
        });
};

// Find a single User with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    User.findOne({
        attributes: {
            exclude: ['Email', 'SessionId', 'IpAddress']
        },
        where: { id: id }
    })
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message: 'Error retrieving User with id=' + id,
            });
        });
};

exports.findOneByDiscordId = (req, res) => {
    const discordId = req.params.discordId;

    User.findOne({
        attributes: {
            exclude: ['Email', 'SessionId', 'IpAddress']
        },
        where: { DiscordUserId: discordId }
    })
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message: 'Error retrieving User with discord id=' + discordId,
            });
        });
}

exports.updateCoins = (req, res) => {
    const discordId = req.params.discordId;
    const coins = req.body.coins;
    const authorUid = req.body.authorDiscordUid;

    User.findOne({
        attributes: ['role'],
        where: {
            DiscordUserId: authorUid,
        },
    })
        .then((user) => {
            console.log(user.dataValues);
            if (user.dataValues.role === 'Admin') {
                User.update(
                    {
                        Coins: db.Sequelize.literal(`Coins + ${coins}`),
                    },
                    {
                        where: {
                            DiscordUserId: discordId,
                        },
                    },
                ).then(() => {
                   User.findOne({
                       attributes: ['coins'],
                       where: {
                           DiscordUserId: discordId,
                       },
                   }).then((totalCoins) => {
                       res.json({
                           coinsAdded: coins,
                           totalCoins: totalCoins.dataValues.coins,
                       });
                   });
                });
            } else {
                res.status(403).send({
                    message: `You don't have permission to add coins to a user`,
                });
            }
        })
        .catch((err) => {
            res.status(500).send({
                message:
                    err.message ||
                    'Some error occurd while trying to update users coins.',
            });
        });
};

// Create a user
exports.create = (req, res) => {

    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: 'Content can not be empty!',
        });
        return;
    }

    User.create(req.body)
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send({
                message: 'Some error occurred while creating a user.',
            });
        });
};

// Checks if an available sessionId exists & return user
exports.getUserBySessionIdAndIp = (req, res) => {
    const GUILD_ID = '632515781070028811';
    const BOT_TOKEN =
        'NjQ5MzQ1MTQwNTc3NTMzOTUy.XtC9ww.dfyf0PKrMhaUzuV28ESRtILG7Vk';
    const sessionId = req.body.SessionId;

    User.findOne({
        where: { SessionId: sessionId, IpAddress: req.clientIp },
    })
        .then((user) => {
            if (user) {
                // Check if user boosted the discord server
                request(
                    {
                        url: `https://discordapp.com/api/guilds/${GUILD_ID}/members/${user.dataValues.DiscordUserId}`,
                        headers: {
                            Authorization: `Bot ${BOT_TOKEN}`,
                        },
                        rejectUnauthorized: false,
                    },
                    (err, response) => {
                        if (err) {
                            res.status(500).send({
                                message: 'Error retrieving Guild Member',
                            });
                        } else {
                            const guildMemberBody = JSON.parse(response.body);
                            if (guildMemberBody.premium_since) {
                                // User is an active booster
                                console.log('Active booster (session)');
                                request(
                                    {
                                        url: `https://eu.blobwar.io:8081/api/v1/shop/skins/owned/${JSON.parse(
                                            user.dataValues.Id,
                                        )}`,
                                        rejectUnauthorized: false,
                                    },
                                    (err, response) => {
                                        if (err) {
                                            res.status(500).send({
                                                message:
                                                    'Error retrieving owned skins',
                                            });
                                        } else {
                                            const ownedSkinsBody = JSON.parse(
                                                response.body,
                                            );
                                            if (!ownedSkinsBody.title) {
                                                const foundNitroSkin = ownedSkinsBody.find(
                                                    (skin) => {
                                                        return skin.Id === 40;
                                                    },
                                                );

                                                if (foundNitroSkin) {
                                                    // User already owns the Nitro skin
                                                } else {
                                                    HasSkin.create({
                                                        UserId: JSON.parse(
                                                            user.dataValues.Id,
                                                        ),
                                                        SkinId: 40,
                                                    })
                                                        .then(
                                                            console.log(
                                                                'Nitro Skin added',
                                                            ),
                                                        )
                                                        .catch((err) => {
                                                            console.log(err);
                                                        });
                                                }
                                            }
                                        }
                                    },
                                );
                            } else {
                                // User is not an active booster
                                request(
                                    {
                                        url: `https://eu.blobwar.io:8081/api/v1/shop/skins/owned/${JSON.parse(
                                            user.dataValues.Id,
                                        )}`,
                                        rejectUnauthorized: false,
                                    },
                                    (err, response) => {
                                        if (err) {
                                            res.status(500).send({
                                                message:
                                                    'Error retrieving owned skins',
                                            });
                                        } else {
                                            const ownedSkinsBody = JSON.parse(
                                                response.body,
                                            );
                                            if (!ownedSkinsBody.title) {
                                                const foundNitroSkin = ownedSkinsBody.find(
                                                    (skin) => {
                                                        return skin.Id === 40;
                                                    },
                                                );

                                                if (foundNitroSkin) {
                                                    // User is not an active booster but still owns the Nitro skin
                                                    HasSkin.destroy({
                                                        where: {
                                                            UserId: JSON.parse(
                                                                user.dataValues
                                                                    .Id,
                                                            ),
                                                            SkinId: 40,
                                                        },
                                                    });
                                                }
                                            }
                                        }
                                    },
                                );
                            }
                        }
                    },
                );
                res.send(user);
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: 'Error retrieving User by SessionId',
            });
        });
};

// Checks if an available sessionId exists & return user
exports.getUserBySessionId = (req, res) => {
    const sessionId = req.body.SessionId;

    User.findOne({
        where: { SessionId: sessionId },
    })
        .then((user) => {
            if (user) {
                res.send(user);
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: 'Error retrieving User by SessionId',
            });
        });
};

// Retrieve the top 100 users with the most xp
exports.getLeaderBoard = (req, res) => {
    const page = req.params.page;

    // If page is not given or less than 1, send top 100 
    if (!page) {
        User.findAll({
            attributes: ['Id', 'Username', 'Xp', 'DiscordUserId'],
            limit: 100,
            order: [[Sequelize.col('Xp'), 'DESC']],
        })
            .then((data) => {
                res.send(data);
            })
            .catch((err) => {
                res.status(500).send({
                    message:
                        err.message ||
                        'Some error occurred while retrieving the user leaderboard.',
                });
            });
    } else {
        let page2 = (page < 1 ? 1 : page) * 10 - 10;
        User.findAll({
            attributes: ['Id', 'Username', 'Xp', 'DiscordUserId'],
            limit: 10,
            offset: page2,
            order: [[Sequelize.col('Xp'), 'DESC']],
        })
            .then((data) => {
                res.send(data);
            })
            .catch((err) => {
                res.status(500).send({
                    message:
                        err.message ||
                        'Some error occurred while retrieving the user leaderboard.',
                });
            });
    }
};
