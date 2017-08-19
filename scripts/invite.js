const program = require('commander');
const mailer = require('../src/lib/mailer');

program
    .version('0.0.0')
    .option('-e, --email [value]', 'Send invite to specific email')
    .option('-c, --category [value]', 'Send invite to everyone in a category')
    .parse(process.argv);

if (program.email !== undefined) {
    console.log('Email:', program.email);
    mailer.sendInvite(program.email)
        .then(() => {
            console.log('Invitation sent');
        })
        .catch((err) => {
            console.error('Failed to send invitation', err);
        });
}

if (program.category !== undefined) {
    console.log('Category:', program.category);
    mailer.sendInvitesByCategory(parseInt(program.category, 10))
        .then(() => {
            console.log('Invitations sent');
        })
        .catch((err) => {
            console.error('Failed to send invitations', err);
        });
}
