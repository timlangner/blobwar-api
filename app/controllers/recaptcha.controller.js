exports.verify = (req, res) => {
    const token = req.body.Token;
    const secret = '6LfwO_UUAAAAACRYeMr8rc0aGMxzylogb9MP0JjD';
    const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`;


    fetch(url, {
        method: 'post'
    }).then(response => response.json())
        .then(data => {
            console.log(data)
        }).catch(() => {
            res.status(500).send({
                message: "Error occured whilst trying to validate recaptcha."
            })
        })
}