const express = require('express');
const bodyParser = require('body-parser')
const fs = require('fs');
const serveStatic = require('serve-static');
const debounce = require('lodash/debounce');
const ENV = process.env.NODE_ENV || 'development';
const DATA_FILE = process.env.DATA_FILE || 'data.json';

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

    // memory cache of guest list on server start
    const dataFile = fs.readFileSync(DATA_FILE);
    let guestList = JSON.parse(dataFile);

    // allows for batch saving of guestList
    function persistData() {
        console.log('Writing data...', DATA_FILE);
        fs.writeFile(DATA_FILE, JSON.stringify(guestList, null, 2) , 'utf-8', () => {
            console.log('Data saved!', DATA_FILE);
        });
    }

    // only for administration
    app.get('/api/guestlist', auth, function(req, res) {
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

    // used by the rsvp form to verify guest email
    app.post('/api/guest', function(req, res) {
        const reqData = req.body;
        console.log('[/api/guest] Request Data:', reqData);

        if (!reqData.email) {
            res.sendStatus(400); // Bad Request
            return;
        }

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

    // used by the rsvp form to submit a response
    app.post('/api/rsvp', function(req, res) {
        const reqData = req.body;
        console.log('[/api/rsvp] Request Data:', reqData);

        if (!reqData.email || !reqData.firstName || !reqData.lastName || !reqData.attending) {
            res.sendStatus(400); // Bad Request
            return;
        }

        const guest = guestList.guests.find(o => o.email === reqData.email);

        if (!guest) {
            res.sendStatus(404); // Not Found
            return;
        }

        guest.attending = reqData.attending;
        guest.extras = reqData.extras;
        guest.comments = reqData.comments;
        guest.responses = guest.responses ? (guest.responses + 1) : 1;

        debounce(persistData, 1000, { maxWait: 5000 })(); // immediately invoke debounce func
        res.sendStatus(200); // OK
    });

    app.get('/', function(req, res) {
        res.send('build/index.html');
    });

    app.listen(PORT, function() {
        console.log('Listening on port ' + PORT);
    });
}
