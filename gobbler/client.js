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
      // Prevent default browser form submit
      event.preventDefault();
      
      console.log(' got submitted ');
      // // Get value from form element
      // var text = event.target.text.value;

      // Meteor.call('addGiblet', text);

      // event.target.text.value = "";
    }
  });


  Accounts.ui.config({
    passwordSignupFields: 'USERNAME_ONLY',
  }); 

}
