Giblets = new Mongo.Collection('giblets');
Notifications = new Mongo.Collection('notifications');


if (Meteor.isServer) {
  Meteor.methods({
      startGibletsOnBoot: function() {
        var giblets = Giblets.find().fetch();
        for( var giblet in giblets ) {
          var thisGiblet = giblets[giblet];
          console.log(thisGiblet.active);
          if (thisGiblet.active) {
            // start cron job!
            Meteor.call('scheduleGiblet', thisGiblet._id, thisGiblet.frequency)
          }
        }
      }
  });
  Meteor.call('startGibletsOnBoot');
}


Meteor.methods({
  updateGiblet: function ( gibletID, data ) {
    Giblets.update({_id: gibletID}, {$set: data});
  },
  addUserSettings: function ( userSettings ) {
    var userId = Meteor.userId();
    Meteor.users.update({_id: userId},
      {$set: {
        chosenName: userSettings.chosenName,
        chosenPhoneNumber: userSettings.chosenPhoneNumber,
        chosenEmail: userSettings.chosenEmail
      }
    });
  },
  clearGibletsDB: function () {
    Giblets.remove({});
    SyncedCron.stop();
  }
});