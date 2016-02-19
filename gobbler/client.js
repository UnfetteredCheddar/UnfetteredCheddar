if (Meteor.isClient) {
  // This code only runs on the client
  Template.body.helpers({
    giblets: [
      { text: "This is task 1" },
      { text: "This is task 2" },
      { text: "This is task 3" }
    ]
  });
  // This code only runs on the client
  Template.body.helpers({
    giblets: function () {

      return Giblets.find({});
    }
  });
  
  Template.addGiblet.events({
    "submit .addGiblet": function (event) {

      event.preventDefault();

      // // Get values from form
      var taskname = event.target.taskname.value;
      var url = event.target.url.value.trim();
      var keywords  = event.target.keywords.value.split(', ');
      var SMS = event.target.SMS.checked;
      var email = event.target.email.checked;
      var frequency = event.target.frequency.value;

      var giblet = {
        taskname: taskname,
        url: url,
        keywords: keywords,
        SMS: SMS,
        email: email,
        frequency: frequency
      };

      Meteor.call('addGiblet', giblet);

  Template.userSettings.events({
    "submit .userSettings": function (event) {
      // Prevent default browser form submit
      // event.preventDefault();
      console.log('User settings fires');

      // Get value from form element
      // var text = event.target.text.value;

      // Insert a task into the collection
      // Meteor.call('addTask', text);
      // Tasks.insert({
      //   text: text,
      //   createdAt: new Date() // current time
      // });

      // Clear form
      // event.target.text.value = "";
    }

  });


  Accounts.ui.config({
    passwordSignupFields: 'USERNAME_ONLY',
  }); 

}
