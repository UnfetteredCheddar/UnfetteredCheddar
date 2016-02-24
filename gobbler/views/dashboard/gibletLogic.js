if (Meteor.isServer) {
  Meteor.methods({
    addGiblet: function () {
      var initActive = false;
      var initFrequency = 1;

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
    removeGiblet: function(id) {
      Meteor.call('stopGiblet', id);
      Giblets.remove(id);
    },
    // updateGibletValue: function(id, key, val) {
    //   var updateObj = {};
    //   updateObj[key] = val;
    //   var updateConfirm = Giblets.update({'_id': id}, {$set: updateObj});
    // },
    updateTitle: function(id, value) {
      console.log('update title');
      var giblet = Giblets.findOne({'_id': id});
      Giblets.update({'_id': id}, {$set: {taskname: value}});
    },
    modifyUrlInArray: function(id, urlIndex, value) {
      console.log('modify url server side', id, urlIndex, value);
      var giblet = Giblets.findOne({'_id': id});
      var urlArray = giblet.url;
      urlArray[urlIndex] = value;
      Giblets.update({'_id': id}, {$set: {url: urlArray}});
    },
    addUrlToArray: function(id) {
      var giblet = Giblets.findOne({'_id': id});
      var urlArray = giblet.url;
      urlArray[urlArray.length] = undefined;
      Giblets.update({'_id': id}, {$set: {url: urlArray}});
    },
    removeUrlFromArray: function(id, urlIndex) {
      // var giblet = Giblets.findOne({'_id': id});
      // var urlArray = giblet.url;
      // urlArray.splice(urlIndex, 1);
      // var key = 'url';
      // Meteor.call('updateGibletValue', id, key, urlArray);
    },
    updateKeywordArray: function() {
      // DO all this
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

  var enterReminderShow = function(event) {
    var reminder = event.target.form.children[0];
    reminder.style.visibility = 'unset';
  };
  var enterReminderHide = function(event) {
    var reminder = event.target.form.children[0];
    reminder.style.visibility = 'hidden';
  };

  Template.giblet.events({
    // Possibly throttle some of this
    'input .gibletTitleInput, change .gibletTitleInput, paste .gibletTitleInput, mouseup .gibletTitleInput, keyup .gibletTitleInput': function(event) {
      console.log('Title modify client side');
      enterReminderShow(event);

      if (event.which === 13) {        
        var gibletId = event.currentTarget.form.attributes['mongoid'].value;
        var newTitle = event.currentTarget.value;
        // console.log(gibletId, newTitle);
        Meteor.call('updateTitle', gibletId, newTitle);
        enterReminderHide(event);
      }
    },
    'input .urlTextInput, change .urlTextInput, paste .urlTextInput, mouseup .urlTextInput, keyup .urlTextInput': function(event) {
      console.log('url modify client side');
      enterReminderShow(event);
      if (event.which === 13) {
        var id = event.currentTarget.form.attributes['mongoid'].value;
        var urlIndex = event.currentTarget.parentNode.attributes['urlIndex'].value;
        var value = event.target.value;
        // console.log('urlindex:', id, urlIndex, value)
        Meteor.call('modifyUrlInArray', id, urlIndex, value);
        enterReminderHide(event);
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
    'input .keywordInput, change .keywordInput, paste .keywordInput, mouseup .keywordInput, keyup .keywordInput': function(event) {
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
        // Meteor.call('updateKeywordArray', gibletId, keywordArray);
      }
    },
    'input .cronJobTimer, change .cronJobTimer, paste .cronJobTimer, mouseup .cronJobTimer, keyup .cronJobTimer': function(event) {
      var id = event.currentTarget.attributes['mongoid'].value;
      var input = event.target.value;
      console.log('cron change', id, input);
      if (!input) {
        input = 1;
      }
      Meteor.call('updateCronTimer', id, input);
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
      // console.log('click client side', event);
      var id = event.currentTarget.attributes['mongoid'].value;      
      Meteor.call('toggleGibletRunningStatus', id)
    },
    'click .removeGibletButton': function(event) {
      var id = event.currentTarget.attributes['mongoid'].value;
      Meteor.call('removeGiblet', id);
    }
  });
}



















