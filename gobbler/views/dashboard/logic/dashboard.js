if (Meteor.isClient) {
  Template.dashboard.helpers({
    // Get and sort giblets
    giblets: function () {
      return Giblets.find({}, {sort : {createdAt: -1}}).fetch();
    }
  });
  UI.registerHelper('compareIndexLength', function ( a, b ) {
    return a === b - 1;
  });
  UI.registerHelper('subtractOne', function ( a ) {
    return a - 1;
  });
}
