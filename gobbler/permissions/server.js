if (Meteor.isServer) {
  Meteor.publish('giblets', function () {
    var currentUser = this.userId;
    return Giblets.find({ owner: currentUser });
  });
  Meteor.publish('notifications', function () {
    var currentUser = this.userId;
    return Notifications.find({ owner: currentUser });
  });
}
