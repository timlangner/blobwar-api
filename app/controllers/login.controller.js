const request = require('request');
const db = require('../models');
const User = db.user;
const HasSkin = db.hasSkin;
const API_URL = "https://api.blobwar.io"
const MAIN_URL = "https://blobwar.io"

// SessionId Generator
function generateSessionId(length) {
    let result = '';
    let chars =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charsLen = chars.length;

    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * charsLen));
    }
    return result;
}

exports.authDiscord = (req, res) => {
    const CODE = req.body.code;
    const CLIENT_ID = '649345140577533952';
    const CLIENT_SECRET = 't_u5HfiZd66Ckz32eDXLyL9s7xoeFMxS';
    const REDIRECT_URI = `${MAIN_URL}/auth/discord`;
    const GUILD_ID = '632515781070028811';
    const BOT_TOKEN =
        'NjQ5MzQ1MTQwNTc3NTMzOTUy.XtC9ww.dfyf0PKrMhaUzuV28ESRtILG7Vk';

    request.post(
        'https://discordapp.com/api/oauth2/token',
        {
            form: {
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                grant_type: 'authorization_code',
                code: CODE,
                redirect_uri: REDIRECT_URI,
                scope: 'identify email',
            },
        },
        (err, httpResponse, body) => {
            if (err) {
                res.status(500).send({
                    message: 'Error retrieving Token',
                });
            } else {
                const tokenBody = JSON.parse(body);
                request(
                    {
                        url: 'https://discordapp.com/api/users/@me',
                        headers: {
                            Authorization: `Bearer ${tokenBody.access_token}`,
                        },
                        rejectUnauthorized: false,
                    },
                    (err, response) => {
                        if (err) {
                            res.status(500).send({
                                message: 'Error retrieving User Object',
                            });
                        } else {
                            const discordUserBody = JSON.parse(response.body);
                            // Override IpAddress
                            User.update(
                                {
                                    IpAddress: req.clientIp,
                                    SessionId: generateSessionId(40),
                                },
                                {
                                    where: {
                                        DiscordUserId: discordUserBody.id,
                                    },
                                },
                            ).then(() => {
                                // Get User data for DiscordUser
                                User.findOne({
                                    where: {
                                        DiscordUserId: discordUserBody.id,
                                    },
                                }).then((user) => {
                                    if (!user) {
                                        // Create user if there's no user with that DiscordUserId
                                        const createUserBody = {
                                            Username: discordUserBody.username,
                                            DiscordUserId: discordUserBody.id,
                                            Email: discordUserBody.email,
                                            SessionId: generateSessionId(40),
                                            IpAddress: req.clientIp,
                                        };
                                        User.create(createUserBody)
                                            .then((createdUser) => {
                                                // Check if user boosted the discord server
                                                console.log('Check if boosted');
                                                request(
                                                    {
                                                        url: `https://discordapp.com/api/guilds/${GUILD_ID}/members/${discordUserBody.id}`,
                                                        headers: {
                                                            Authorization: `Bot ${BOT_TOKEN}`,
                                                        },
                                                        rejectUnauthorized: false,
                                                    },
                                                    (err, response) => {
                                                        if (err) {
                                                            res.status(
                                                                500,
                                                            ).send({
                                                                message:
                                                                    'Error retrieving Guild Member',
                                                            });
                                                        } else {
                                                            console.log(
                                                                'Guild Member',
                                                                response.body,
                                                            );
                                                            const guildMemberBody = JSON.parse(
                                                                response.body,
                                                            );
                                                            if (
                                                                guildMemberBody.premium_since
                                                            ) {
                                                                // User is an active booster
                                                                HasSkin.create({
                                                                    UserId: JSON.parse(
                                                                        createdUser
                                                                            .dataValues
                                                                            .Id,
                                                                    ),
                                                                    SkinId: 40,
                                                                })
                                                                    .then(
                                                                        console.log('Nitro Skin added'),
                                                                    )
                                                                    .catch(
                                                                        (
                                                                            err,
                                                                        ) => {
                                                                            console.log(
                                                                                err,
                                                                            );
                                                                        },
                                                                    );
                                                            }
                                                        }
                                                    },
                                                );
                                                res.status(201).send(
                                                    createdUser,
                                                );
                                            })
                                            .catch((err) => {
                                                console.log(err);
                                                res.status(500).send({
                                                    message:
                                                        'Some error occurred while creating a user.',
                                                });
                                            });
                                    } else {
                                        // Check if user boosted the discord server
                                        console.log('Check if boosted');
                                        console.log(
                                            'RequestURL',
                                            `https://discordapp.com/api/guilds/${GUILD_ID}/members/${discordUserBody.id}`
                                        );
                                        request(
                                            {
                                                url: `https://discordapp.com/api/guilds/${GUILD_ID}/members/${discordUserBody.id}`,
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
                                                    console.log(
                                                        'GuildMember',
                                                        response.body,
                                                    );
                                                    const guildMemberBody = JSON.parse(
                                                        response.body,
                                                    );
                                                    if (
                                                        guildMemberBody.premium_since
                                                    ) {
                                                        // User is an active booster
                                                        console.log(
                                                            'Active booster',
                                                        );
                                                        request(
                                                            {
                                                                url: `${API_URL}/v1/shop/skins/owned/${JSON.parse(
                                                                    user
                                                                        .dataValues
                                                                        .Id,
                                                                )}`,
                                                                rejectUnauthorized: false,
                                                            },
                                                            (err, response) => {
                                                                if (err) {
                                                                    res.status(
                                                                        500,
                                                                    ).send({
                                                                        message:
                                                                            'Error retrieving owned skins',
                                                                    });
                                                                } else {
                                                                    const ownedSkinsBody = JSON.parse(
                                                                        response.body,
                                                                    );
                                                                    if (
                                                                        !ownedSkinsBody.title
                                                                    ) {
                                                                        const foundNitroSkin = ownedSkinsBody.find(
                                                                            (
                                                                                skin,
                                                                            ) => {
                                                                                return (
                                                                                    skin.Id ===
                                                                                    40
                                                                                );
                                                                            },
                                                                        );

                                                                        if (
                                                                            foundNitroSkin
                                                                        ) {
                                                                            // User already owns the Nitro skin
                                                                            console.log(
                                                                                'User already owns the nitro skin',
                                                                            );
                                                                        } else {
                                                                            HasSkin.create(
                                                                                {
                                                                                    UserId: JSON.parse(
                                                                                        user
                                                                                            .dataValues
                                                                                            .Id,
                                                                                    ),
                                                                                    SkinId: 40,
                                                                                },
                                                                            )
                                                                                .then(
                                                                                    console.log(
                                                                                        'Nitro Skin added',
                                                                                    ),
                                                                                )
                                                                                .catch(
                                                                                    (
                                                                                        err,
                                                                                    ) => {
                                                                                        console.log(
                                                                                            err,
                                                                                        );
                                                                                    },
                                                                                );
                                                                        }
                                                                    }
                                                                }
                                                            },
                                                        );
                                                    } else {
                                                        // User is not an active booster
                                                        console.log(
                                                            'Not an active booster',
                                                        );
                                                        request(
                                                            {
                                                                url: `${API_URL}/v1/shop/skins/owned/${JSON.parse(
                                                                    user
                                                                        .dataValues
                                                                        .Id,
                                                                )}`,
                                                                rejectUnauthorized: false,
                                                            },
                                                            (err, response) => {
                                                                if (err) {
                                                                    res.status(
                                                                        500,
                                                                    ).send({
                                                                        message:
                                                                            'Error retrieving owned skins',
                                                                    });
                                                                } else {
                                                                    const ownedSkinsBody = JSON.parse(
                                                                        response.body,
                                                                    );
                                                                    if (
                                                                        !ownedSkinsBody.title
                                                                    ) {
                                                                        const foundNitroSkin = ownedSkinsBody.find(
                                                                            (
                                                                                skin,
                                                                            ) => {
                                                                                return (
                                                                                    skin.Id ===
                                                                                    40
                                                                                );
                                                                            },
                                                                        );

                                                                        if (
                                                                            foundNitroSkin
                                                                        ) {
                                                                            // User is not an active booster but still owns the Nitro skin
                                                                            HasSkin.destroy(
                                                                                {
                                                                                    where: {
                                                                                        UserId: JSON.parse(
                                                                                            user
                                                                                                .dataValues
                                                                                                .Id,
                                                                                        ),
                                                                                        SkinId: 40,
                                                                                    },
                                                                                },
                                                                            );
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
                                });
                            });
                        }
                    },
                );
            }
        },
    );
};
