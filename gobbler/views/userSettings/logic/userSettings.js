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
      $('.userSettings').validate({
        rules: {
          email: {
            email: true
          },
          phone: {
            minlength: 10,
            maxlength: 20
          }
        },
        messages: {
          email: {
            email: 'Please enter a valid email address.'
          },
          phone: {
            minlength: 'Please enter a valid phone number.',
            maxlength: 'Please enter a valid phone number.'
          }
        }
      });
      // Get values from form element
      var chosenName = event.target.name.value;
      var chosenPhoneNumber = formatPhoneNumber(event.target.phone.value);
      var chosenEmail = event.target.email.value;
      appendSavedMessage();
      var userSettings = {
        chosenName: chosenName,
        chosenPhoneNumber: chosenPhoneNumber,
        chosenEmail: chosenEmail
      };
      Meteor.call('addUserSettings', userSettings);
    }
  });
}

// helper function to format number correctly for Twilio SMS
function formatPhoneNumber(num) {
  if (!num.length) {
    return '';
  }
  var validChars = /[^\d|\+]/g;
  var newNum = num.split(' ').join('').split('-').join('').split('(').join('').split(')').join('').split('+');
  if (newNum[0][0] === '1' || newNum[1] && newNum[1][0] === '1') {
    newNum.splice(0, 0, '+');
  } else {
    newNum.splice(0, 0, '+1');
  }
  newNum = newNum.join('');

  if (newNum.search(validChars) === -1) {
    if ( $('#changesSaved').has('#invalid-phone').length ) {
      $('#invalid-phone').remove();
    }
    return newNum;
  } else {
    if ( ! $('#changesSaved').has('#invalid-phone').length ) {
      if ( $('#changesSaved').has('#saved-changes-message').length ) {
        $('#saved-changes-message').remove();
      }
      $('#changesSaved').append('<p id="invalid-phone">Please enter a valid phone number</p>');
    }
    return '';
  }
}

function appendSavedMessage() {
  if ( ! $('#changesSaved').has('p').length ) {
    $('#changesSaved').append('<p id="saved-changes-message">Your settings have been saved</p>');
  }
}
