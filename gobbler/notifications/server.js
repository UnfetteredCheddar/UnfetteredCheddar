if (Meteor.isServer) {
  process.env.MAIL_URL = Meteor.settings.MAIL_URL;
  process.env.TWILIO_NUMBER = Meteor.settings.TWILIO_NUMBER;
  process.env.TWILIO_ACCOUNT_SID = Meteor.settings.TWILIO_ACCOUNT_SID;
  process.env.TWILIO_AUTH_TOKEN = Meteor.settings.TWILIO_AUTH_TOKEN;
  process.env.TEST_NUMBER = Meteor.settings.TEST_NUMBER;

  Meteor.methods({
    // send user an email when they get a notifcation
    createNotification: function ( giblet, url, notificationKeys ) {
      Notifications.insert({
        createdAt: new Date(),
        owner: giblet.owner,
        gibletID: giblet._id,
        keywords: notificationKeys,
        url: url
      });
      if (giblet.email) {
        Meteor.call('sendEmail', giblet, url, notificationKeys);
      }
      if (giblet.SMS) {
        Meteor.call('sendSMS', giblet, url, notificationKeys);
      }
    },

    sendEmail: function( giblet, url, notificationKeys ) {
      var user = Meteor.users.findOne({_id: giblet.owner});
      var subject = 'Gobbler alert: Found keywords from ' + giblet.taskname;
      var text = 'Found keywords ' + notificationKeys.join(', ') + ' at ' + url;
      var email;
      if (user.services.facebook) {
        email = user.services.facebook.email;
      }
      if (user.services.google) {
        email = user.services.google.email;
      }
      if (user.chosenEmail) {
        email = user.chosenEmail;
      }
      Email.send({
        to: email,
        from: 'GobblerGonnaGobble@gmail.com',
        subject: subject,
        text: text
      });
    },

    sendSMS: function( giblet, url, notificationKeys ) {
      var user = Meteor.users.findOne({_id: giblet.owner});
      var subject = 'Gobbler alert: Found keywords from ' + giblet.taskname;
      var text = 'Found keywords ' + notificationKeys.join(', ') + ' at ' + url;
      HTTP.call(
        "POST",
        'https://api.twilio.com/2010-04-01/Accounts/' +
        process.env.TWILIO_ACCOUNT_SID + '/SMS/Messages.json', {
            params: {
                From: process.env.TWILIO_NUMBER,
                To: process.env.TEST_NUMBER,
                Body: text
            },
            // Set your credentials as environment variables
            // so that they are not loaded on the client
            auth:
                process.env.TWILIO_ACCOUNT_SID + ':' +
                process.env.TWILIO_AUTH_TOKEN
        },
        // Print error or success to console
        function (error) {
            if (error) {
                console.log(error);
            }
            else {
                console.log('SMS sent successfully.');
            }
        }
      );
		}
  });
}
