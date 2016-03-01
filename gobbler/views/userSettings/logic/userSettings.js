if (Meteor.isServer) {
  Meteor.publish("usersChosenData", function () {
    var output = Meteor.users.find(
      { _id: this.userId}, 
      { fields:
        { 'services': 1,
          'chosenName': 1,
          'chosenEmail': 1,
          'chosenPhoneNumber': 1
        }
      }
    );
    console.log(output);
    return output;
  });
}

if (Meteor.isClient) {
  Tracker.autorun(function() {
    Meteor.subscribe("usersChosenData");
  });

  Template.userSettings.helpers({
    chosenName: function() {
      return Meteor.user().chosenName;
    },
    chosenPhoneNumber: function() {
      return Meteor.user().chosenPhoneNumber;
    },
    chosenEmail: function() {
      return Meteor.user().chosenEmail;
    }
  });

  Template.userSettings.events({
    "submit .userSettings": function ( event ) {
      event.preventDefault();
      // Get values from form element
      var chosenName = event.target.name.value;
      var chosenPhoneNumber = event.target.phone.value;
      var chosenEmail = event.target.email.value;
      var userSettings = {
        chosenName: chosenName,
        chosenPhoneNumber: chosenPhoneNumber,
        chosenEmail: chosenEmail
      }
      Meteor.call('addUserSettings', userSettings);
    }
  });
}
