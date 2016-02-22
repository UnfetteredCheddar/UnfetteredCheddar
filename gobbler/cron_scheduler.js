if (Meteor.isServer) {

  console.log('CRON JOBS SCHEDULER+++++++++++++++++++++++++++');

  Meteor.methods({
    scheduleGiblet: function(mongoId, frequency) {
      console.log('schdule giblet fires!', frequency);

      frequency = parseInt(frequency);

      SyncedCron.add({
        name: mongoId,
        schedule: function(parser) {
          return parser.recur().every(frequency).minute();
        },
        job: function() {
          console.log('do the thing on schdule');
        }
      });
    },
    stopGiblet: function(id) {
      // SyncedCron.remove(id);
    }

  });
}