if (Meteor.isServer) {
  
  process.env.MAIL_URL = Meteor.settings.MAIL_URL;

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
        //Meteor.call('sendSMS', giblet, url, notificationKeys);
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
    }
  });
}