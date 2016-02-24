if (Meteor.isClient) {
  Template.viewNotifications.helpers({
    notifications: function() {
      return Notifications.find({}, {sort : {createdAt: -1}, limit:25 }).fetch();
    }
  });
};
