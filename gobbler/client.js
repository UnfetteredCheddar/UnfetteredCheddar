if (Meteor.isClient) {

  Meteor.subscribe('giblets');
  Meteor.subscribe('notifications');

  Accounts.ui.config({
    passwordSignupFields: 'USERNAME_ONLY',
  });

}
