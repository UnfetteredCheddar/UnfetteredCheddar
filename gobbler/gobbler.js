Meteor.methods({
  addGiblet: function ( giblet ) {
    // Make sure the user is logged in before inserting a task
    // if (! Meteor.userId()) {
    //   throw new Meteor.Error("not-authorized");
    // }
 
    Giblets.insert({
      createdAt: new Date(),
      owner: Meteor.userId(),
      taskname: giblet.taskname,
      url: giblet.url,
      keywords: giblet.keywords,
      SMS: giblet.SMS,
      email: giblet.email,
      frequency: giblet.frequency
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
