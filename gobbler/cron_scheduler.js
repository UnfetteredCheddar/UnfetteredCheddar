if (Meteor.isServer) {

  console.log('CRON JOBS SCHEDULER+++++++++++++++++++++++++++');

  Meteor.methods({
    scheduleGiblet: function(mongoId, frequency, url) {
      console.log('schdule giblet fires!', frequency);

      frequency = parseInt(frequency);

      SyncedCron.add({
        name: mongoId,
        schedule: function(parser) {
          return parser.recur().every(frequency).minute();
        },
        job: function() {
          var urlArr = [url];
          Meteor.call('runGiblet', urlArr, mongoId);
        }
      });
    },
    stopGiblet: function(id) {
      // SyncedCron.remove(id);
    }

  });
  
  SyncedCron.start();

}