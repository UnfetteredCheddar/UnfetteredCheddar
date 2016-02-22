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
          var currentGiblet = Giblets.find({ id: mongoId });
          console.log( currentGiblet );
          Meteor.call('scrapePage', currentGiblet.url);
        }
      });
    },
    stopGiblet: function(id) {
      // SyncedCron.remove(id);
    }

  });
  
  SyncedCron.start();

}