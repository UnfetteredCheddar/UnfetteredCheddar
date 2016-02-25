if (Meteor.isClient) {
  Template.dashboard.helpers({
    giblets: function() {
<<<<<<< HEAD
      return Giblets.find().fetch();
=======
      return Giblets.find({}, {sort : {createdAt: -1}}).fetch();
>>>>>>> Renders giblets in reverse chronological order
    }
  });

  UI.registerHelper('compareIndexLength', function (a, b) {
    return a === b - 1;
  });

  UI.registerHelper('subtractOne', function(a) {
    return a - 1;
  })
};