if (Meteor.isServer) {
  Meteor.methods({
    // Instantiate an empty giblet
    addGiblet: function () {
      var initActive = false;
      var initFrequency = "1";
      var gibletId = Giblets.insert({
        createdAt: new Date(),
        owner: Meteor.userId(),
        taskname: '',
        url: [undefined],
        keywords: [],
        SMS: false,
        email: false,
        webData: {},
        frequency: initFrequency,
        active: initActive
      });
      if (initActive) {
        Meteor.call('scheduleGiblet', gibletId, initFrequency);
      }
    },
    // Modify giblets
    removeGiblet: function ( id ) {
      Meteor.call('stopGiblet', id);
      Giblets.remove(id);
    },
    updateTitle: function ( id, value ) {
      console.log('update title');
      var giblet = Giblets.findOne({'_id': id});
      Giblets.update({'_id': id}, {$set: {taskname: value}});
    },
    modifyUrlInArray: function ( id, urlIndex, value ) {
      console.log('modify url server side', id, urlIndex, value);
      var giblet = Giblets.findOne({'_id': id});
      var urlArray = giblet.url;
      urlArray[urlIndex] = value;
      Giblets.update({'_id': id}, {$set: {url: urlArray}});
    },
    addUrlToArray: function ( id ) {
      var giblet = Giblets.findOne({'_id': id});
      var urlArray = giblet.url;
      urlArray[urlArray.length] = undefined;
      Giblets.update({'_id': id}, {$set: {url: urlArray}});
    },
    removeUrlFromArray: function ( id, urlIndex ) {
      var giblet = Giblets.findOne({'_id': id});
      var urlArray = giblet.url;
      urlArray.splice(urlIndex, 1);
      var key = 'url';
      Giblets.update({'_id': id}, {$set: {url: urlArray}});
    },
    updateKeywordArray: function ( id, keywordString ) {
      var giblet = Giblets.findOne({'_id': id});
      var keywordArray = keywordString.split(',');
      for( var i = 0; i < keywordArray.length; i++ ) {
        keywordArray[i] = keywordArray[i].trim();
      }
      Giblets.update({'_id': id}, {$set: {keywords: keywordArray}})
    },
    toggleSmsStatus: function ( id ) {
      var giblet = Giblets.findOne({'_id': id});
      Giblets.update({'_id': id}, {$set: {SMS: !giblet.SMS}});
    },
    toggleEmailStatus: function ( id ) {
      var giblet = Giblets.findOne({'_id': id});
      Giblets.update({'_id': id}, {$set: {email: !giblet.email}});
    },
    toggleGibletRunningStatus: function ( id ) {
      var giblet = Giblets.findOne({'_id': id});
      var id = giblet._id;
      var frequency = giblet.frequency;
      var newActiveValue = !giblet.active
      console.log('toggle: ', id, frequency, newActiveValue);

      Giblets.update({'_id': id}, {$set: {active: newActiveValue}});
      
      if (newActiveValue) {
        // run giblet once on start
        Meteor.call('runGiblet', id);
        // schdedule giblet for recurring future jobs
        Meteor.call('scheduleGiblet', id, frequency );
      } else {
        Meteor.call('stopGiblet', id);
      }
    },
    updateCronTimer: function ( id, cronTime ) {
      console.log('Update cron timer', id, cronTime);
      Giblets.update({'_id': id}, {$set: {frequency: cronTime}});
      var giblet = Giblets.findOne({'_id': id});
      var active = giblet.active;
      if (active) {
        Meteor.call('updateGibletTimer', id, cronTime);
      };
    }
  });
}
