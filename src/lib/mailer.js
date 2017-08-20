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
     * @param {number} category - Filter mailees down by their category id.
     */
    sendInvitesByCategory(category) {
        if (category === undefined) {
            return Promise.reject('Missing required parameter: category');
        }

        const dataFile = fs.readFileSync('../data.json');
        const guestList = JSON.parse(dataFile);
        console.log('Guestlist:', guestList.guests);
        const emailToList = guestList.guests.filter(o => o.category === category).map(o => o.email);
        console.log('Emails found in category:', emailToList);

        let addNote = '';
        if (category === 3) { // Cali friends
            addNote = `
                <tr>
                    <td style="padding:0 20px;color:#41d2ff;font-style:italic;">
                        <p><b>Note to our California friends</b>: We are formally extending this invite, but we do not expect any of you to fly 2,000 miles to watch a 15 minute wedding ceremony. Please consider joining us for the destination wedding party instead. Details will follow on Facebook.</p>
                    </td>
                </tr>
            `;
        }

        let promises = [];
        emailToList.forEach((emailTo) => {
            this.sendInvite(emailTo, addNote);
        });
        return Promise.all(promises);
    }

    /**
     * 
     * @param {string} emailTo - Email address to send the invitation to.
     */
    sendInvite(emailTo, addNote) {
        const dataFile = fs.readFileSync('../data.json');
        const guestList = JSON.parse(dataFile);
        console.log('Emailing To: %s', emailTo);

        // setup email data with unicode symbols
        let mailOptions = {
            from: '"Kat & Ian" <ianlamb32@gmail.com>',
            to: emailTo,
            subject: 'Kat & Ian\'s Wedding',
            text: `
                Katherine Haldane and Ian Lamb request the honor of your presence at their wedding.
                
                SATURDAY - DECEMBER 23, 2017 - 3:00 PM
                FERNWOOD HILLS
                9533 OXBOW DR - KOMOKA, ONTARIO, CANADA

                For more details about the wedding including dress code, dinner plans and after party - please visit our website at http://katsaidyes.ianlamb.com

                Please RSVP by September 30th. You can respond now by coping the special link below into your browser or by filling out the form yourself on our website.

                http://katsaidyes.ianlamb.com?e=${emailTo}
            `,
            html: `
                <table cellspacing="0" style="background:#333;font-size:16px;color:#f6f6f6;text-align:center;width:600px;border:0;">
                    <tr>
                        <td>
                            <a href="http://katsaidyes.ianlamb.com">
                                <img src="cid:invitationHeader" alt="Wedding Invitation Header" />
                            </a>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:0 20px;">
                            <p style="font-size:24px;"><b><i>Katherine Haldane</i></b> and <b><i>Ian Lamb</i></b> request the honor of your presence at their wedding.</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:0 20px;font-weight:bold;">
                            <p>
                                SATURDAY &#9672; DECEMBER 23, 2017 &#9672; 3:00 PM
                                <br />
                                FERNWOOD HILLS
                                <br />
                                9533 OXBOW DR &#9672; KOMOKA, ONTARIO, CANADA
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:0 20px;">
                            <p>
                                For more details about the wedding including dress code, dinner plans and after party &mdash; please visit our website 
                                <a href="http://katsaidyes.ianlamb.com" style="color:#f90;text-decoration:none;">
                                    http://katsaidyes.ianlamb.com
                                </a>
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:0 20px;">
                            <p>Please RSVP by <b>September 30<sup>th</sup></b>. You can respond now by <a href="http://katsaidyes.ianlamb.com?e=${emailTo}" style="color:#f90;text-decoration:none;">clicking this special link</a> or by filling out the form yourself on our website.</p>
                        </td>
                    </tr>
                    ${addNote}
                    <tr>
                        <td>&nbsp;</td>
                    </tr>
                </table>
            `,
            attachments: [{
                filename: 'invitation_header2.jpg',
                path: '../src/assets/images/invitation_header2.jpg',
                cid: 'invitationHeader' //same cid value as in the html img src
            }]
        };

        // send mail with defined transport object
        return this.transporter.sendMail(mailOptions)
            .then((info) => {
                console.log('Message %s sent: %s', info.messageId, info.response);
            });
    }
}

module.exports = new Mailer(process.env.SMTP_USER, process.env.SMTP_PASS);