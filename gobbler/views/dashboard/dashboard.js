if (Meteor.isClient) {
  Template.dashboard.helpers({
    giblets: function() {
      return Giblets.find().fetch();
    }
  });

  UI.registerHelper('compareIndexLength', function (a, b) {
    return a === b - 1;
  });

  Template.giblet.events({
    "change input:radio": function(event) {
      Meteor.call('updateGiblet', this._id, {active: JSON.parse(event.target.value)});
    }
  });
};
