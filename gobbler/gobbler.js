Meteor.methods({
  addTask: function (text) {
    console.log('add task tset');
    // Make sure the user is logged in before inserting a task
    // if (! Meteor.userId()) {
    //   throw new Meteor.Error("not-authorized");
    // }
 
    Tasks.insert({
      text: text,
      createdAt: new Date(),
      // owner: Meteor.userId(),
      // username: Meteor.user().username
    });
  },
  deleteTask: function (taskId) {
    Tasks.remove(taskId);
  },
  setChecked: function (taskId, setChecked) {
    Tasks.update(taskId, { $set: { checked: setChecked} });
  }
});

Tasks = new Mongo.Collection("tasks");