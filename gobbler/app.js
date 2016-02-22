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
      frequency: giblet.frequency,
      active: true
    });

    // console.log(Meteor)
    Meteor.call('scheduleGiblet', gibletId, giblet.frequency);
  },

  deleteGiblet: function ( gibletID ) {
    Giblets.remove( gibletID );
  },

  addUserSettings: function(userSettings) {
    var currentUser = Meteor.users.find().fetch();
    var userId = currentUser[0]._id;
    Meteor.users.update( {_id: userId}, {$set:
      {
        chosenName: userSettings.chosenName,
        chosenPhoneNumber: userSettings.chosenPhoneNumber,
        chosenEmail: userSettings.chosenEmail
      }
    });
  }

});




SyncedCron.start();