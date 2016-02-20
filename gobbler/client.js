if (Meteor.isClient) {

  Meteor.subscribe('giblets');

  Accounts.ui.config({
    passwordSignupFields: 'USERNAME_ONLY',
  });

}
