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
      var chosenPhoneNumber = formatPhoneNumber(event.target.phone.value);
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

// helper function to format number correctly for Twilio SMS
function formatPhoneNumber(num) {
  if (!num.length) {
    return '';
  }
  var newNum = num.split(' ').join('').split('-').join('').split('(').join('').split(')').join('').split('+');
  if (newNum[0][0] === '1' || newNum[1] && newNum[1][0] === '1') {
    newNum.splice(0, 0, '+');
  } else {
    newNum.splice(0, 0, '+1');
  }
  newNum = newNum.join('');
  return newNum;
}

