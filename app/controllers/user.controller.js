const db = require('../models');
const request = require('request');
const User = db.user;
const HasSkin = db.hasSkin;
const Sequelize = db.Sequelize;
const API_URL = "http://localhost:8081/api";
// const API_URL = "https://api.blobwar.io";

let loggedIn = [];

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

exports.setCoins = (req, res) => {
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
            if (user.dataValues.role === 'Admin') {
                User.update(
                    {
                        Coins: coins,
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
                            coins: totalCoins.dataValues.coins,
                        });
                    });
                });
            } else {
                res.status(403).send({
                    message: `You don't have permission to set coins of a user`,
                });
            }
        })
        .catch((err) => {
            res.status(500).send({
                message:
                    err.message ||
                    'Some error occurd while trying to set users coins.',
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

// Remove user from login history after refresh
exports.refreshLogin = (req, res) => {
    if (req.clientIp.replace('::ffff:', '') != req.app.locals.ip) {
        res.status(401).send({
            message: 'Unauthorized'
        })
    } else {
        const sessionId = req.params.sessionId;

        // Remove user from array
        const index = loggedIn.findIndex((user) => user.session === sessionId);
        if (index >= 0) loggedIn.splice(index, 1);

        res.status(200).send({
            message: `The user with the sessionId ${sessionId} got removed from the login history.`,
        });
    }
};

// Remove all users when a server restarts
exports.serverRestart = (req, res) => {
    const port = req.params.serverPort;

    // Remove users from array
    for (let i = 0; i < loggedIn.length; i++) {
        const index = loggedIn.findIndex((user) => user.serverPort === port);
        if (index >= 0) loggedIn.splice(index, 1);
    }

    res.status(200).send({
        message: `The users on the server with port "${port}" got removed from the login history.`,
    });

} 

// Check if user is already logged in
exports.checkLogin = (req, res) => {
    if (req.clientIp.replace('::ffff:', '') != req.app.locals.ip) {
        res.status(401).send({
            message: 'Unauthorized'
        })
    } else {

        const sessionId = req.params.sessionId;
        const port = req.body.port;

        // Check if there's already a ping of the user from the last two minutes
        const isLoggedIn = loggedIn.find((user) => {
            return user.session === sessionId && user.serverPort === port;
        });

        if (!isLoggedIn) loggedIn.push({ sessionId: sessionId, serverPort: port });

        console.log(loggedIn);

        if (isLoggedIn) {
            res.status(200).send({
                message: `The user with the sessionId ${sessionId} is currently logged in.`,
            });
        } else {
            res.status(204).send();
        }
    }
};

// Checks if an available sessionId exists & return user
exports.getUserBySessionIdAndIp = (req, res) => {
    const GUILD_ID = '632515781070028811';
    const BOT_TOKEN =
        'NjQ5MzQ1MTQwNTc3NTMzOTUy.XtC9ww.dfyf0PKrMhaUzuV28ESRtILG7Vk';
    const sessionId = req.body.SessionId;

    User.findOne({
        where: { SessionId: sessionId },
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
                                        url: `${API_URL}/v1/shop/skins/owned/${JSON.parse(
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
                                        url: `${API_URL}/v1/shop/skins/owned/${JSON.parse(
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
            } else {
                res.status(204).send();
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
    if (req.clientIp.replace('::ffff:', '') != req.app.locals.ip) {
        res.status(401).send({
            message: 'Unauthorized'
        })
    } else {
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
    }
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

exports.addCoins = async (req, res) => {
    if (req.clientIp.replace('::ffff:', '') != req.app.locals.ip) {
        res.status(401).send({
            message: 'Unauthorized'
        })
    } else {
        const userId = req.params.userId;
        const coins = req.body.coins;

        try {
            await User.update(
                {
                    Coins: db.Sequelize.literal(`Coins + ${coins}`),
                },
                {
                    where: {
                        Id: userId,
                    },
                },
            );

            const userCoins = await User.findOne({
                attributes: ['coins'],
                where: {
                    Id: userId,
                },
            });

            await res.json({
                addedCoins: coins,
                totalCoins: userCoins.dataValues.coins,
            });
        } catch (err) {
            res.status(500).send();
        }
    }
};

exports.addXp = async (req, res) => {
    if (req.clientIp.replace('::ffff:', '') != req.app.locals.ip) {
        res.status(401).send({
            message: 'Unauthorized'
        })
    } else {
        const userId = req.params.userId;
        const xp = req.body.xp;

        try {
            await User.update(
                {
                    Xp: db.Sequelize.literal(`Xp + ${xp}`),
                },
                {
                    where: {
                        Id: userId,
                    },
                },
            );

            const userXp = await User.findOne({
                attributes: ['xp'],
                where: {
                    Id: userId,
                },
            });

            await res.json({
                addedXp: xp,
                totalXp: userXp.dataValues.xp,
            });
        } catch (err) {
            res.status(500).send();
        }
    }
};
