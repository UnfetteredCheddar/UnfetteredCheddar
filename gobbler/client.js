if (Meteor.isClient) {
  // This code only runs on the client
  Template.body.helpers({
    tasks: [
      { text: "This is task 1" },
      { text: "This is task 2" },
      { text: "This is task 3" }
    ]
  });
  // This code only runs on the client
  Template.body.helpers({
    tasks: function () {

      return Tasks.find({});
    }
  });
  
  Template.body.events({
    "submit .new-task": function (event) {
      // Prevent default browser form submit
      event.preventDefault();

      // Get value from form element
      var text = event.target.text.value;

      // Insert a task into the collection
      Meteor.call('addTask', text);
      // Tasks.insert({
      //   text: text,
      //   createdAt: new Date() // current time
      // });

      // Clear form
      event.target.text.value = "";
    }
  });


  Accounts.ui.config({
    passwordSignupFields: 'USERNAME_ONLY'
  });

}
