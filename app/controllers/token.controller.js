const db = require('../models');
const DiscordTokens = db.discordTokens;
const User = db.user;


// Checks if an available access & refresh token exists & return user
exports.findUser = (req, res) => {
    const access_token = req.body.access_token;
    const refresh_token = req.body.refresh_token;

    DiscordTokens.findOne({
        where: { access_token: access_token, refresh_token: refresh_token }
    })
        .then((tokens) => {
            if (tokens) {
                // Get User from token userId
                User.findOne({
                    where: { Id: tokens.dataValues.UserId },
                }).then((user) => {
                    res.send(user);
                });
            }
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send({
                message: 'Error retrieving tokens'
            });
        });
};