if (Meteor.isClient) {
  Template.dashboard.helpers({
    giblets: function() {
      return Giblets.find().fetch();
    }
  });


  UI.registerHelper('compareIndexLength', function (a, b) {
    console.log('COmparing!!!!!!!!!!!!!!!!!!');
    console.log('A: ', a);
    console.log('B: ', b);


    return a === b - 1;
  });

  Template.dashboard.events({
    "submit .addGiblet": function (event) {
      event.preventDefault();
      // // Get values from form
      var taskname = event.target.taskname.value;
      var url = event.target.url.value.trim();
      var keywords  = event.target.keywords.value.split(', ');
      var SMS = event.target.SMS.checked;
      var email = event.target.email.checked;
      var frequency = event.target.frequency.value;
      var giblet = {
        taskname: taskname,
        url: url,
        keywords: keywords,
        SMS: SMS,
        email: email,
        frequency: frequency
      };
      Meteor.call('addGiblet', giblet);
    }
  });

  Template.giblet.events({
    "change input:radio": function(event) {
      Meteor.call('updateGiblet', this._id, {active: JSON.parse(event.target.value)});
    }
  });
};
