if (Meteor.isServer) {

  console.log('CRON JOBS SCHEDULER+++++++++++++++++++++++++++');

  var scheduleGiblet = function(mongoId) {
    console.log('schdule giblet fires!');

    SyncedCron.add({
      name: '12345',
      schedule: function(parser) {
        // parser is a later.parse object
        return parser.text('every 10 seconds');
      },
      job: function() {
        // var numbersCrunched = CrushSomeNumbers();
        // return numbersCrunched;
      }
    });
  }

  scheduleGiblet();

  SyncedCron.start();

}