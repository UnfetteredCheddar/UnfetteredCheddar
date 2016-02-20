if (Meteor.isClient) {
  Template.userSettings.events({
    "submit .userSettings": function (event) {
      // Prevent default browser form submit
      event.preventDefault();
      // Get value from form element
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
};
