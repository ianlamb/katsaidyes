const fs = require('fs');
const nodemailer = require('nodemailer');

class Mailer {

    constructor(user, pass) {
        this.transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user,
                pass
            }
        });
    }

    /**
     * 
     * @param {number} category - Filter mailees down by their category id. If ommitted, email all guests.
     */
    sendInvitations(category) {
        const dataFile = fs.readFileSync('../data.json');
        const guestList = JSON.parse(dataFile);
        const emailTo = guestList.guests.filter(o => o.category === category).map(o => o.email).join(', ');
        console.log('Emailing To: %s', emailTo);

        // setup email data with unicode symbols
        let mailOptions = {
            from: '"Kat & Ian" <ianlamb32@gmail.com>',
            to: emailTo,
            subject: 'Kat & Ian\'s Wedding',
            text: 'Test',
            html: '<b>Hello world ?</b>'
        };

        // send mail with defined transport object
        return this.transporter.sendMail(mailOptions)
            .then((info) => {
                console.log('Message %s sent: %s', info.messageId, info.response);
            });
    }
}

module.exports = new Mailer(process.env.SMTP_USER, process.env.SMTP_PASS);