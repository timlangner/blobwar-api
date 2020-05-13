const request = require('request');

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
            console.log('body', body);
            console.log('token', body.access_token);
            request(
                {
                    url:
                        'https://discordapp.com/api/users/@me',
                    headers: {
                        Authorization: `Bearer ${body.access_token}`,
                    },
                    rejectUnauthorized: false,
                },
                (err, response) => {
                    if (err) {
                        res.status(500).send({
                            message: 'Error retrieving User Object',
                        });
                    } else {
                        res.send(response);
                    }
                },
            );
        }
    });
};
