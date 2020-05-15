const request = require('request');
const db = require('../models');
const User = db.user;
const DiscordTokens = db.discordTokens;

exports.authDiscord = (req, res) => {
    const CODE = req.body.code;
    const CLIENT_ID = '649345140577533952';
    const CLIENT_SECRET = 't_u5HfiZd66Ckz32eDXLyL9s7xoeFMxS';
    const REDIRECT_URI = 'http://127.0.0.1:8080/auth/discord';

    request.post('https://discordapp.com/api/oauth2/token', {
        form: {
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            grant_type: 'authorization_code',
            code: CODE,
            redirect_uri: REDIRECT_URI,
            scope: 'identify email',
        },
    }, (err, httpResponse, body) => {
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
                        // Get User data for DiscordUser
                        User.findOne({
                            where: { DiscordUserId: discordUserBody.id },
                        }).then((user) => {
                            if (!user) {
                                // Create user if there's no user with that DiscordUserId
                                const createUserBody = {
                                    Username: discordUserBody.username,
                                    Discriminator: discordUserBody.discriminator,
                                    DiscordUserId: discordUserBody.id,
                                    Email: discordUserBody.email,
                                };
                                User.create(createUserBody)
                                    .then((createdUser) => {
                                        console.log(createdUser.dataValues.Id);
                                        DiscordTokens.create({
                                            UserId: createdUser.dataValues.Id,
                                            access_token:
                                                tokenBody.access_token,
                                            refresh_token:
                                                tokenBody.refresh_token,
                                            CreationTime: Date.now(),
                                        })
                                            .then(() => {
                                                res.status(201).send(
                                                    createdUser,
                                                );
                                            })
                                            .catch((err) => {
                                                console.log(err);
                                                res.status(500).send({
                                                    message:
                                                        'Some error occurred while adding discord tokens.',
                                                });
                                            });
                                    })
                                    .catch((err) => {
                                        console.log(err);
                                        res.status(500).send({
                                            message:
                                                'Some error occurred while creating a user.',
                                        });
                                    });
                            } else {
                                res.send(user);
                            }
                        });
                    }
                },
            );
        }
    });
};
