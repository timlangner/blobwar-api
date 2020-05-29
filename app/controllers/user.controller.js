const db = require('../models');
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
    User.findAll()
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
exports.getUserBySessionId = (req, res) => {
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
                console.log('Check if boosted');
                request(
                    {
                        url: `https://discordapp.com/api/guilds/${GUILD_ID}/members/${JSON.parse(user.dataValues.Id)}`,
                        headers: {
                            Authorization: `Bot ${BOT_TOKEN}`,
                        },
                        rejectUnauthorized: false,
                    },
                    (err, response) => {
                        if (err) {
                            res.status(500).send({
                                message:
                                    'Error retrieving Guild Member',
                            });
                        } else {
                            console.log('GuildMember', response.body);
                            const guildMemberBody = JSON.parse(
                                response.body,
                            );
                            if (guildMemberBody.premium_since) {
                                // User is an active booster
                                console.log('Active booster');
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
                                            const foundNitroSkin = ownedSkinsBody.find(
                                                (skin) => {
                                                    return (
                                                        skin.Id === 40
                                                    );
                                                },
                                            );

                                            if (foundNitroSkin) {
                                                // User already owns the Nitro skin
                                                console.log(
                                                    'User already owns the nitro skin',
                                                );
                                            } else {
                                                HasSkin.create({
                                                    UserId: JSON.parse(
                                                        user
                                                            .dataValues
                                                            .Id,
                                                    ),
                                                    SkinId: 40,
                                                })
                                                    .then(console.log)
                                                    .catch((err) => {
                                                        console.log(
                                                            err,
                                                        );
                                                    });
                                            }
                                        }
                                    },
                                );
                            } else {
                                // User is not an active booster
                                console.log('Not an active booster');
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
                                            const foundNitroSkin = ownedSkinsBody.find(
                                                (skin) => {
                                                    return (
                                                        skin.Id === 40
                                                    );
                                                },
                                            );

                                            if (foundNitroSkin) {
                                                // User is not an active booster but still owns the Nitro skin
                                                HasSkin.destroy({
                                                    where: {
                                                        UserId: JSON.parse(
                                                            user
                                                                .dataValues
                                                                .Id,
                                                        ),
                                                        SkinId: 40,
                                                    },
                                                });
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

// Retrieve the top 100 users with the most xp
exports.getLeaderBoard = (req, res) => {
    User.findAll({
        attributes: ['Id', 'Username', 'Xp'],
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
};
