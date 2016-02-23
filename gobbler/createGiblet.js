if (Meteor.isClient) {
  console.log("Create giblet");

  var urlCount = 1;

  Template.gibletForm.events({
      'click .addUrlButton': function(){
          // code goes here
          urlCount++;
          console.log('click registered', urlCount);

      }
  });

}