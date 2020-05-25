const db = require('../models');
const User = db.user;
const Sequelize = db.Sequelize;

// Logout
exports.logout = (req, res) => {
    const sessionId = req.body.SessionId;

    User.update(
        { SessionId: null, IpAddress: null },
        { where: { SessionId: sessionId, IpAddress: req.headers['x-forwarded-for'] } }
    )
        .then(() => {
            res.send("logout")
        })
        .catch((err) => {
            res.status(500).send({
                message:
                    err.message ||
                    'Some error occurd while trying to logout.',
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
    const sessionId = req.body.SessionId;

    User.findOne({
        where: { SessionId: sessionId, IpAddress: req.clientIp },
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
