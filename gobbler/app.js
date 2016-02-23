Giblets = new Mongo.Collection('giblets');
Notifications = new Mongo.Collection('notifications');

Meteor.methods({
  addGiblet: function () {
    var gibletId = Giblets.insert({
      createdAt: new Date(),
      owner: Meteor.userId(),
      taskname: 'New Giblet',
      url: [undefined],
      keywords: [],
      SMS: '0',
      email: '0',
      frequency: 1,
      active: false
    });

    // Meteor.call('scheduleGiblet', gibletId, giblet.frequency, giblet.url);
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
    Giblets.find().fetch().forEach(function(giblet) {
      Giblets.remove(giblet._id);
    });
  }

});
