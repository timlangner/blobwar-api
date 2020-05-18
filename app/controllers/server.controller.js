const fs = require('fs');
const path = require('path');

// Create a JSON file
exports.createJSON = (req, res) => {
    const body = JSON.stringify(req.body);
    fs.writeFileSync('serverStats.json', body, 'utf8', () => {
        console.log('File created!');
    });
};

// Read JSON file
exports.readJSON = (req, res) => {
    const data = fs.readFileSync('serverStats.json');
    res.send(data);
};
