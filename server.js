const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const fs = require('fs');

const SECRET = 'irvine';

app.use(express.static('build'));
app.use(bodyParser.json());

app.get('/guestlist', function(req, res) {
    const dataFile = fs.readFileSync('data.json');
    let guestList = JSON.parse(dataFile);
    guestList._total = guestList.guests.length;
    guestList._responded = guestList.guests.filter((o) => o.attending).length;
    guestList._responsePercentage = Math.floor(guestList._responded / guestList._total * 100);
    res.json(guestList);
});

app.post('/rsvp', function(req, res) {
    const reqData = req.body;
    console.log('Request Data:', reqData);

    if (!reqData.secret || !reqData.firstName || !reqData.lastName || !reqData.attending) {
        res.sendStatus(400); // Bad Request
        return;
    }

    if (reqData.secret.trim().toLowerCase() !== SECRET) {
        res.sendStatus(403); // Forbidden
        return;
    }

    const dataFile = fs.readFileSync('data.json');
    let guestList = JSON.parse(dataFile);
    let verifiedGuest = guestList.guests.find((guest) => {
        return reqData.firstName.trim().toLowerCase() ===  guest.firstName.toLowerCase()
            && reqData.lastName.trim().toLowerCase() ===  guest.lastName.toLowerCase();
    });

    if (!verifiedGuest) {
        res.sendStatus(418); // I'm a teapot
        return;
    }

    verifiedGuest.attending = reqData.attending;
    verifiedGuest.extras = reqData.extras;
    fs.writeFile('./data.json', JSON.stringify(guestList, null, 2) , 'utf-8');
    res.sendStatus(200); // OK
});

app.get('/', function(req, res) {
    res.send('build/index.html');
});

app.listen(8181, function() {
    console.log('Listening on port 8181');
});
