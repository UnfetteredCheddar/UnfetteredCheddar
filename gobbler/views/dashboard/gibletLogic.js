if (Meteor.isServer) {
  Meteor.methods({
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
    removeGiblet: function(id) {
      Meteor.call('stopGiblet', id);
      Giblets.remove(id);
    },
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
      var giblet = Giblets.findOne({'_id': id});
      var urlArray = giblet.url;
      urlArray.splice(urlIndex, 1);
      var key = 'url';
      Giblets.update({'_id': id}, {$set: {url: urlArray}});
    },
    updateKeywordArray: function(id, keywordArray) {
      var giblet = Giblets.findOne({'_id': id});
      Giblets.update({'_id': id}, {$set: {keywords: keywordArray}})
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
        var id = giblet._id;
        var frequency = giblet.frequency;
        var newActiveValue = !giblet.active
        console.log('toggle: ', id, frequency, newActiveValue);

        Giblets.update({'_id': id}, {$set: {active: newActiveValue}});
        
        if (newActiveValue) {
          Meteor.call('scheduleGiblet', id, frequency );
        } else {
          Meteor.call('stopGiblet', id);
        }
    },
    updateCronTimer: function(id, cronTime) {
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
      // console.log('Title modify client side');
      enterReminderShow(event);

      if (event.which === 13) {        
        var gibletId = event.currentTarget.form.attributes['gibletID'].value;
        var newTitle = event.currentTarget.value;
        // console.log(gibletId, newTitle);
        Meteor.call('updateTitle', gibletId, newTitle);
        enterReminderHide(event);
      }
    },
    'input .urlTextInput, change .urlTextInput, paste .urlTextInput, mouseup .urlTextInput, keyup .urlTextInput': function(event) {
      // console.log('url modify client side');
      enterReminderShow(event);
      if (event.which === 13) {
        var id = event.currentTarget.form.attributes['gibletID'].value;
        var urlIndex = event.currentTarget.parentNode.attributes['urlIndex'].value;
        var value = event.target.value;
        // console.log('urlindex:', id, urlIndex, value)
        Meteor.call('modifyUrlInArray', id, urlIndex, value);
        enterReminderHide(event);
      }
    },
    'click div.addUrlButton': function(event) {
      var id = event.currentTarget.attributes['gibletID'].value;
      Meteor.call('addUrlToArray', id);
    },
    'click div.subtractUrlButton': function(event) {
      var id = event.currentTarget.attributes['gibletID'].value;
      var urlIndex = event.currentTarget.attributes['urlindex'].value;
      // console.log(event);
      Meteor.call('removeUrlFromArray', id, urlIndex);
    },
    'input .keywordInput, change .keywordInput, paste .keywordInput, mouseup .keywordInput, keyup .keywordInput': function(event) {
      enterReminderShow(event);
      
      if (event.which === 13) {        
        console.log('keypress enter keyword');

        var id = event.currentTarget.form.attributes['gibletID'].value;
        var newKeywords = event.currentTarget.value;

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
        Meteor.call('updateKeywordArray', id, keywordArray);
        enterReminderHide(event);
      }
    },
    'input .cronJobTimer, change .cronJobTimer, paste .cronJobTimer, mouseup .cronJobTimer, keyup .cronJobTimer': function(event) {
      enterReminderShow(event);
      if (event.which === 13) {        
        var id = event.currentTarget.form.attributes['gibletID'].value;
        var input = event.currentTarget.value;
        console.log('cron change', id, input);
        if (!input) {
          input = undefined;
        }
        Meteor.call('updateCronTimer', id, input);
        enterReminderHide(event);
      }
    },
    'click .smsStatus': function(event) {
      var id = event.currentTarget.form.attributes['gibletID'].value;
      Meteor.call('toggleSmsStatus', id);
    },
    'click .emailStatus': function(event) {
      var id = event.currentTarget.form.attributes['gibletID'].value;
      Meteor.call('toggleEmailStatus', id);
    },
    'click .gibletRunningStatusForm': function(event) {
      // console.log('click client side', event);
      var id = event.currentTarget.form.attributes['gibletID'].value;      
      Meteor.call('toggleGibletRunningStatus', id);
    },
    'click .removeGibletButton': function(event) {
      var id = event.currentTarget.attributes['gibletID'].value;
      Meteor.call('removeGiblet', id);
    }
  });
}