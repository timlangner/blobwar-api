const db = require('../models');
const User = db.user;
const Op = db.Sequelize.Op;

// Create and Save a new User
exports.create = (req, res) => {};

User.addScope('exclude', {
            exclude: ['createdAt', 'updatedAt', 'pwd'],
        });

// Retrieve all Users from the database.
exports.findAll = (req, res) => {
    User.findAll({
        attributes: {
            exclude: ['pwd', 'createdAt', 'updatedAt' ],
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
        where: { id: id },
        attributes: {
            exclude: ['pwd', 'createdAt', 'updatedAt'],
        },
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

// Update a User by the id in the request
exports.update = (req, res) => {};

// Delete a User with the specified id in the request
exports.delete = (req, res) => {};

// Delete all Users from the database.
exports.deleteAll = (req, res) => {};
