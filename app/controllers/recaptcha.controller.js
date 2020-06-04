const request = require('request')

exports.verify = (req, res) => {
    const token = req.body.Token;
    const secret = '6LfwO_UUAAAAACRYeMr8rc0aGMxzylogb9MP0JjD';
    const url = `https://www.google.com/recaptcha/api/siteverify`;


    request.post(url, {
        body: {
            secret: secret,
            response: token
        }
    }, (err, response) => {
        if (err) {
            res.status(500).send({
                message: "Error occured whilst trying to validate recaptcha."
            })
        } else {
            console.log(response)
        }
    })
}