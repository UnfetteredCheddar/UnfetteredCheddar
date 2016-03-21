if (Meteor.isServer) {
  Meteor.methods({
    scheduleGiblet: function ( gibletID, frequency ) {
      frequency = parseInt(frequency);
      SyncedCron.add({
        name: gibletID,
        schedule: function ( parser ) {
          return parser.recur().every(frequency).minute();
        },
        job: function () {
          Meteor.call('runGiblet', gibletID);
        }
      });
    },
    stopGiblet: function ( gibletID ) {
      // console.log('Stop Giblet Timer');
      SyncedCron.remove(gibletID);
    },
    updateGibletTimer: function ( gibletID, frequency ) {
      // console.log('update Giblet Timer', gibletID, frequency);
      Meteor.call('stopGiblet', gibletID);
      Meteor.call('scheduleGiblet', gibletID, frequency);
    }
  });
  SyncedCron.start();
}
