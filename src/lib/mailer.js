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
    send(category) {
        // setup email data with unicode symbols
        let mailOptions = {
            from: '"Kat & Ian" <ianlamb32@gmail.com>',
            to: '',
            subject: 'Kat & Ian\'s Wedding',
            text: 'Hello world ?',
            html: '<b>Hello world ?</b>'
        };

        // send mail with defined transport object
        this.transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message %s sent: %s', info.messageId, info.response);
        });
    }
}

module.exports = Mailer;