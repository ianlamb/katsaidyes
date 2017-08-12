const mailer = require('../src/lib/mailer');

let category = null;
if (process.argv.length > 2) {
    category = parseInt(process.argv[2], 10);
    if (isNaN(category)) {
        category = null;
    }
}

mailer.sendInvitations(category)
    .then(() => {
        console.log('Invitations sent');
    })
    .catch((err) => {
        console.error('Failed to send invitations', err);
    });
