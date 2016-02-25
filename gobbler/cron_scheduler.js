if (Meteor.isServer) {
  
  Meteor.methods({
    scheduleGiblet: function(gibletID, frequency) {
      console.log('Start giblet Timer!', frequency);
      frequency = parseInt(frequency);
      var giblet = Giblets.findOne({'_id': gibletID});
      var urlArray = giblet.url;
      console.log(urlArray);
      SyncedCron.add({
        name: gibletID,
        schedule: function(parser) {
          return parser.recur().every(frequency).minute();
        },
        job: function() {
          console.log('Get rolling!', urlArray, gibletID);
          // var urlArr = [url];
          Meteor.call('runGiblet', urlArray, gibletID);
        }
      });
    },

    stopGiblet: function(gibletID) {
      console.log('Stop Giblet Timer');
      SyncedCron.remove(gibletID);
    },

    updateGibletTimer: function(gibletID, frequency) {
      console.log('update Giblet Timer', gibletID, frequency);
      Meteor.call('stopGiblet', gibletID);
      Meteor.call('scheduleGiblet', gibletID, frequency);
    }


  });
  
  SyncedCron.start();

}