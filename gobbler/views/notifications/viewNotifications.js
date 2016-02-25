if (Meteor.isClient) {

  Template.registerHelper('formatDate', function(date) {
    return moment(date).fromNow();
  });

  Template.viewNotifications.helpers({
    notifications: function() {
      console.log(Notifications.find({}, {sort : {createdAt: -1}, limit:25 }).fetch());
      return Notifications.find({}, {sort : {createdAt: -1}, limit:25 }).fetch();
    }
  });
};
