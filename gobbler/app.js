Giblets = new Mongo.Collection('giblets');
Notifications = new Mongo.Collection('notifications');

Meteor.methods({
  addGiblet: function ( giblet ) {
    var gibletId = Giblets.insert({
      createdAt: new Date(),
      owner: Meteor.userId(),
      taskname: giblet.taskname,
      url: giblet.url,
      keywords: giblet.keywords,
      SMS: giblet.SMS,
      email: giblet.email,
      webData: {},
      frequency: giblet.frequency,
      active: true
    });

    Meteor.call('scheduleGiblet', gibletId, giblet.frequency, giblet.url);
  },

  updateGiblet: function( gibletID, data ) {
    Giblets.update({_id: gibletID}, {$set: data});
  },

  deleteGiblet: function ( gibletID ) {
    Giblets.remove( gibletID );
  },

  addUserSettings: function( userSettings ) {
    var currentUser = Meteor.users.find().fetch();
    var userId = currentUser[0]._id;
    Meteor.users.update({_id: userId},
      {$set: {
        chosenName: userSettings.chosenName,
        chosenPhoneNumber: userSettings.chosenPhoneNumber,
        chosenEmail: userSettings.chosenEmail
      }
    });
  },

  clearGibletsDB: function() {
    Giblets.remove({});
    SyncedCron.stop();
  }

});
