Giblets = new Mongo.Collection('giblets');
Notifications = new Mongo.Collection('notifications');

Meteor.methods({
  updateGiblet: function( gibletID, data ) {
    Giblets.update({_id: gibletID}, {$set: data});
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
