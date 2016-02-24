if (Meteor.isServer) {
  
  Meteor.methods({
    scheduleGiblet: function(id, frequency) {
      console.log('Start giblet Timer!', frequency);
      frequency = parseInt(frequency);
      var giblet = Giblets.findOne({'_id': id});
      var urlArray = giblet.url;
      console.log(urlArray);
      SyncedCron.add({
        name: id,
        schedule: function(parser) {
          return parser.recur().every(frequency).minute();
        },
        job: function() {
          console.log('Get rolling!', urlArray, id);
          // var urlArr = [url];
          // Meteor.call('scrapePage', urlArr, id);
        }
      });
    },

    stopGiblet: function(id) {
      console.log('Stop Giblet Timer');
      SyncedCron.remove(id);
    },

    updateGibletTimer: function(id, frequency) {
      console.log('update Giblet Timer', id, frequency);
      Meteor.call('stopGiblet', id);
      Meteor.call('scheduleGiblet', id, frequency);
    }


  });
  
  SyncedCron.start();

}