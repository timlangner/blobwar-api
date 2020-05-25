const fs = require('fs');
const path = require('path');

// Create a JSON file
exports.createJSON = (req, res) => {
    fs.readFile('serverStats.json', 'utf8', function (err, data) {
        if (data && data !== undefined && Object.keys(JSON.parse(data)).length > 0) {
            let saveData = JSON.parse(data)

            const gamemode = req.body.server.name.replace(/[0-9]/g, '').replace(/[_]/g, '');
            const number = req.body.server.name.replace(/[A-z]/g, '').replace(/[_]/g, '')

            if (saveData[gamemode] === undefined) {
                saveData[gamemode] = {}
            }

            if (req.body.shutdown === true) {
                delete saveData[gamemode][number]

                if (Object.keys(saveData[gamemode]).length === 0) delete saveData[gamemode]
            } else {
                saveData[gamemode][number] = req.body;
            }

            fs.writeFileSync('serverStats.json', JSON.stringify(saveData));
            res.status(200).send({
                message: 'File written',
            });
        } else {
            const saveData = {};
            const gamemode = req.body.server.name.replace(/[0-9]/g, '').replace(/[_]/g, '');
            const number = req.body.server.name.replace(/[A-z]/g, '').replace(/[_]/g, '')
            saveData[gamemode] = { [number]: req.body }
            fs.writeFileSync('serverStats.json', JSON.stringify(saveData));
            res.status(200).send({
                message: 'Success',
            });
        }
    })
};

// Read JSON file
exports.readJSON = (req, res) => {
    const data = fs.readFileSync('serverStats.json');
    res.send(data);
};
