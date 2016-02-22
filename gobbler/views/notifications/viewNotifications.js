if (Meteor.isClient) {
  Template.viewNotifications.helpers({
    notifications: function() {
      return Notifications.find().fetch();
    }
  });
};
