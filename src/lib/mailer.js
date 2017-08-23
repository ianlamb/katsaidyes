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
        const emailToList = guestList.guests.filter(o => o.category === category).map(o => o.email);
        console.log('Emails found in category:', emailToList);

        let honorary = '';
        if (category === 4) { // bridesmaids
            honorary = `
                <tr>
                    <td style="padding:0 20px;color:#41d2ff;font-weight:bold;">
                        <p>Congratulations! You were selected to be one of Kat's Bridesmaids. We are honoured to have you by our side for this special moment.</p>
                    </td>
                </tr>
            `;
        } else if (category === 5) { // maid of honor
            honorary = `
                <tr>
                    <td style="padding:0 20px;color:#41d2ff;font-weight:bold;">
                        <p>Sadly this is my wedding so I can't embarrass you with your video dancing to 'Party in the USA' this time... Congratulations! You have been chosen by 1313 Frankenqueen to be my Maid of Honor! I am absolutely honoured to have you by my side for this special moment. Love you!</p>
                    </td>
                </tr>
            `;
        } else if (category === 6) { // groomsmen
            honorary = `
                <tr>
                    <td style="padding:0 20px;color:#41d2ff;font-weight:bold;">
                        <p>Congratulations! You were selected to be one of Ian's Groomsmen. We are honoured to have you by our side for this special moment.</p>
                    </td>
                </tr>
            `;
        } else if (category === 7) { // best man
            honorary = `
                <tr>
                    <td style="padding:0 20px;color:#41d2ff;font-weight:bold;">
                        <p>Congratulations! You have been Math.random()'ly selected to be Ian's Best Man! Just kidding about the random part, I am absolutely honoured to have you by my side for this special moment. Love you man.</p>
                    </td>
                </tr>
            `;
        }

        let note = '';
        if (category === 3) { // international friends
            note = `
                <tr>
                    <td style="padding:0 20px;color:#41d2ff;font-style:italic;">
                        <p><b>Note to our international friends</b>: We are formally extending this invite, but we do not expect any of you to fly 2,000 miles to watch a 15 minute wedding ceremony. Please consider joining us for the destination wedding party instead. Details will follow on Facebook.</p>
                    </td>
                </tr>
            `;
        } else if ([4, 5, 6, 7].indexOf(category) !== -1) { // bridesmaids / groomsmen
            note = `
                <tr>
                    <td style="padding:0 20px;color:#41d2ff;font-style:italic;">
                        <p><b>Note to our Bridesmaids &amp; Groomsmen</b>: We are still figuring out pre-ceremony gatherings. Please make yourself available a couple hours before the ceremony and we will keep you informed as plans formulate :)</p>
                    </td>
                </tr>
            `;
        }

        const promises = emailToList.map((emailTo) => {
            return this.sendInvite(emailTo, honorary, note);
        });
        return Promise.all(promises);
    }

    /**
     * 
     * @param {string} emailTo - Email address to send the invitation to.
     */
    sendInvite(emailTo, honorary, note) {
        console.log('Emailing To: %s', emailTo);

        // setup email data with unicode symbols
        let mailOptions = {
            from: '"Kat & Ian" <ianlamb32@gmail.com>',
            to: emailTo,
            subject: 'Kat & Ian\'s Wedding',
            text: `
                Katherine Haldane and Ian Lamb request the honour of your presence at their wedding.
                
                SATURDAY - DECEMBER 23, 2017 - 2:00 PM
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
                            <p style="font-size:24px;"><b><i>Katherine Haldane</i></b> and <b><i>Ian Lamb</i></b> request the honour of your presence at their wedding.</p>
                        </td>
                    </tr>
                    ${honorary}
                    <tr>
                        <td style="padding:0 20px;font-weight:bold;">
                            <p>
                                SATURDAY &#9672; DECEMBER 23, 2017 &#9672; 2:00 PM
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
                    ${note}
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

        // only send email if env is production
        if (process.env.NODE_ENV !== 'production') {
            console.warn('[DEV MODE] NOT sending email');
            return;
        }

        // send mail with defined transport object
        return this.transporter.sendMail(mailOptions)
            .then((info) => {
                console.log('Message %s sent: %s', info.messageId, info.response);
            });
    }
}

module.exports = new Mailer(process.env.SMTP_USER, process.env.SMTP_PASS);