const express = require('express');
const bodyParser = require('body-parser')
const fs = require('fs');
const serveStatic = require("serve-static");
const ENV = process.env.NODE_ENV || 'development';

function sanitizeEmail(email) {
    let parts = email.toLowerCase().split('@');
    parts[0] = parts[0].replace(/\./g, '');
    return parts.join('@');
}

function auth(req, res, next) {
    const secret = process.env.SECRET;
    const reqSecret = req.query.secret;
    console.log('[AUTH] Secret: %s, reqSecret: %s', secret, reqSecret);
    if (secret !== undefined && reqSecret !== secret) {
        res.sendStatus(403);
        return;
    }
    next();
}

module.exports = (PORT) => {
    PORT = PORT || 8181;

    const app = express();

    if (ENV === 'production') {
        app.use(serveStatic('build'));
    }

    app.use(bodyParser.json());

    app.get('/api/guestlist', auth, function(req, res) {
        const dataFile = fs.readFileSync('data.json');
        let guestList = JSON.parse(dataFile);
        guestList.simpleList = guestList.guests.map((o) => o.firstName + ' ' + o.lastName);
        guestList._total = guestList.guests.length;
        guestList._responded = guestList.guests.filter((o) => o.responses).length;
        guestList._attending = guestList.guests.filter((o) => o.attending === 'yes').length;
        guestList._extras = guestList.guests.reduce((a, o, i) => {
            return a + (o.extras || 0);
        }, 0);
        guestList._responsePercentage = Math.floor(guestList._responded / guestList._total * 100);
        res.json(guestList);
    });

    app.post('/api/guest', function(req, res) {
        const reqData = req.body;
        console.log('Request Data:', reqData);

        if (!reqData.email) {
            res.sendStatus(400); // Bad Request
            return;
        }

        // TODO cache data file
        const dataFile = fs.readFileSync('data.json');
        const guestList = JSON.parse(dataFile);
        const guest = guestList.guests.find(o => sanitizeEmail(o.email) === sanitizeEmail(reqData.email));

        if (!guest) {
            res.sendStatus(404); // Not Found
            return;
        }

        res.json({
            email: guest.email,
            firstName: guest.firstName,
            lastName: guest.lastName
        });
    });

    app.post('/api/rsvp', function(req, res) {
        const reqData = req.body;
        console.log('Request Data:', reqData);

        if (!reqData.email || !reqData.firstName || !reqData.lastName || !reqData.attending) {
            res.sendStatus(400); // Bad Request
            return;
        }

        const dataFile = fs.readFileSync('data.json');
        const guestList = JSON.parse(dataFile);
        const guest = guestList.guests.find(o => o.email === reqData.email);

        if (!guest) {
            res.sendStatus(404); // Not Found
            return;
        }

        guest.attending = reqData.attending;
        guest.extras = reqData.extras;
        guest.comments = reqData.comments;
        guest.responses = guest.responses ? (guest.responses + 1) : 1;

        // possible race condition if two requests come in at the same time, hopefully that doesn't happen
        fs.writeFile('./data.json', JSON.stringify(guestList, null, 2) , 'utf-8');
        res.sendStatus(200); // OK
    });

    app.get('/', function(req, res) {
        res.send('build/index.html');
    });

    app.listen(PORT, function() {
        console.log('Listening on port ' + PORT);
    });
}
