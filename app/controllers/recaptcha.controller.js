const request = require('request')

exports.verify = (req, res) => {
    const token = req.body.Token;
    const secret = '6LfwO_UUAAAAACRYeMr8rc0aGMxzylogb9MP0JjD';
    const url = `https://www.google.com/recaptcha/api/siteverify`;


    request.post(url, {
        form: {
            secret: secret,
            response: token
        }
    }, (err, httpResponse, response) => {
        if (err) {
            res.status(500).send({
                message: "Error occured whilst trying to validate recaptcha."
            })
        } else {
            const data = JSON.parse(response);

            if (data.score && data.score >= 0.5) {
                res.send({
                    message: "human"
                })
            }

            if (data.score && data.score < 0.5) {
                res.send({
                    message: "bot"
                })
            }

            if (!data.score) {
                res.status(500).send({
                    message: "Error occured whilst trying to check recaptcha score."
                })
            }
        }
    })
}