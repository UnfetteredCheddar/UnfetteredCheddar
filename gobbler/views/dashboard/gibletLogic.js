if (Meteor.isServer) {
  Meteor.methods({
    addGiblet: function () {
      var gibletId = Giblets.insert({
        createdAt: new Date(),
        owner: Meteor.userId(),
        taskname: '',
        url: [undefined],
        keywords: [],
        SMS: false,
        email: false,
        frequency: 1,
        active: false
      });
      // Meteor.call('scheduleGiblet', gibletId, giblet.frequency, giblet.url);
    },
    removeGiblet: function(id) {
      Giblets.remove(id);
    },
    updateGibletValue: function(id, key, val) {
      var updateObj = {};
      updateObj[key] = val;
      var updateConfirm = Giblets.update({'_id': id}, {$set: updateObj});
    },
    addUrlToArray: function(id) {
      var giblet = Giblets.findOne({'_id': id});
      var urlArray = giblet.url;
      urlArray[urlArray.length] = undefined;
      Giblets.update({'_id': id}, {$set: {url: urlArray}});
    },
    removeUrlFromArray: function(id, urlIndex) {
      var giblet = Giblets.findOne({'_id': id});
      var urlArray = giblet.url;
      urlArray.splice(urlIndex, 1);
      var key = 'url';
      Meteor.call('updateGibletValue', id, key, urlArray);
    },
    modifyUrlInArray: function(id, urlIndex, value) {
      var giblet = Giblets.findOne({'_id': id});
      var urlArray = giblet.url;
      urlArray[urlIndex] = value;
      Giblets.update({'_id': id}, {$set: {url: urlArray}});
    },
    toggleSmsStatus: function(id) {
      var giblet = Giblets.findOne({'_id': id});
      Giblets.update({'_id': id}, {$set: {SMS: !giblet.SMS}});
    },
    toggleEmailStatus: function(id) {
      var giblet = Giblets.findOne({'_id': id});
      Giblets.update({'_id': id}, {$set: {email: !giblet.email}});
    },
    toggleGibletRunningStatus: function(id) {
        var giblet = Giblets.findOne({'_id': id});
        Giblets.update({'_id': id}, {$set: {active: !giblet.active}});

    },
    updateCronTimer: function(id, cronTime, url) {
      console.log('Update cron timer', id, cronTime);
      Giblets.update({'_id': id}, {$set: {frequency: cronTime}});
      Meteor.call('scheduleGiblet', id, cronTime);
    }
  });
}

if (Meteor.isClient) {

  Template.big_plus.events({
    'click .big_plus_div': function(event) {
      event.preventDefault();
      Meteor.call('addGiblet');
    }
  });

  Template.giblet.events({
    'keypress input.gibletTitleInput': function(event) {
      if (event.which === 13) {        
        // TODO: clean this up... this is crazy
        // The id should be stored on every elemet so we don't have to
        // look around so much with the jquery selectors...
        var gibletId = event.target.parentNode.attributes.gibletId.value;
        var newTitle = event.target.value;
        var dbTarget = 'taskname';
        Meteor.call('updateGibletValue', gibletId, dbTarget, newTitle);
      }
    },
    'keypress input.keywordInput': function(event) {
      if (event.which === 13) {        
        console.log('keypress enter keyword');
        // TODO: this also needs to be cleaned up.
        // No referencing parent nodes !!
        var gibletId = event.target.parentNode.parentNode.attributes.gibletId.value;
        var newKeywords = event.target.value;

        var dbTarget = 'keywords';

        var cleanCommaSeperatedString = function(string) {
          var finalKeywords = [];
          var stringArray = string.split(',');
          for( var i = 0; i < stringArray.length; i++ ) {
            var thisEntry = stringArray[i];
            if (thisEntry === '') {
            } else {
              finalKeywords.push( thisEntry.trim() );
            }
          }
          return finalKeywords;
        };
        var keywordArray = cleanCommaSeperatedString(newKeywords);
        Meteor.call('updateGibletValue', gibletId, dbTarget, keywordArray);
      }
    },
    'keypress input.urlTextInput': function(event) {
      if (event.which === 13) {
        var id = event.currentTarget.attributes['mongoid'].value;
        var urlIndex = event.currentTarget.attributes['urlIndex'].value;
        var input = event.target.value;
        Meteor.call('modifyUrlInArray', id, urlIndex, input);
      }
    },
    'click div.addUrlButton': function(event) {
      var id = event.currentTarget.attributes['mongoid'].value;
      Meteor.call('addUrlToArray', id);
    },
    'click div.subtractUrlButton': function(event) {
      var id = event.currentTarget.attributes['mongoid'].value;
      var urlIndex = event.currentTarget.attributes['urlindex'].value;
      Meteor.call('removeUrlFromArray', id, urlIndex);
    },
    'click .smsStatus': function(event) {
      var id = event.currentTarget.attributes['mongoid'].value;
      Meteor.call('toggleSmsStatus', id);
    },
    'click .emailStatus': function(event) {
      var id = event.currentTarget.attributes['mongoid'].value;
      Meteor.call('toggleEmailStatus', id);
    },
    'click .gibletRunningStatusForm': function(event) {
      var id = event.currentTarget.attributes['mongoid'].value;      
      Meteor.call('toggleGibletRunningStatus', id)
    },
    'click .removeGibletButton': function(event) {
      var id = event.currentTarget.attributes['mongoid'].value;
      Meteor.call('removeGiblet', id);
    },
    'input .cronJobTimer': function(event) {
      var id = event.currentTarget.attributes['mongoid'].value;
      var input = event.target.value;
      console.log('cron change', id, input);
      if (!input) {
        input = 1;
      }
      Meteor.call('updateCronTimer', id, input);
    }
  });
}



















