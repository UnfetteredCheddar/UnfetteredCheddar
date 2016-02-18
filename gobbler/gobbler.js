Meteor.methods({
  addGiblet: function (text) {
    console.log('add giblet');
    // Make sure the user is logged in before inserting a task
    // if (! Meteor.userId()) {
    //   throw new Meteor.Error("not-authorized");
    // }
 
    Giblets.insert({
      text: text,
      createdAt: new Date(),
      owner: Meteor.userId(),
      // username: Meteor.user().username
    });
  },
  deleteGiblet: function ( gibletID ) {
    Giblets.remove( gibletID );
  }
  // setChecked: function (taskId, setChecked) {
  //   Giblets.update(taskId, { $set: { checked: setChecked} });
  // }
});

Giblets = new Mongo.Collection("giblets");
