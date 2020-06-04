const request = require('request');

exports.verify = (req, res) => {
    const token = req.body.Token;

    const verifyBody = {
        secret: '6LfwO_UUAAAAACRYeMr8rc0aGMxzylogb9MP0JjD',
        response: token
    }

    request({
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        url: 'https://www.google.com/recaptcha/api/siteverify',
        body: JSON.stringify(verifyBody)
    }, (err, response) => {
        if (err) {
            res.status(500).send({
                message: "Error occured whilst trying to validate recaptcha."
            })
        } else {
            console.log(response.body)
        }
    })
}