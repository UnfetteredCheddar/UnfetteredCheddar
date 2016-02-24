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
    removeGiblet: function ( gibletID ) {
      Giblets.remove( gibletID );
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
    'input .gibletTitleInput': function(event) {
      // TODO: clean this up... this is crazy
      // The id should be stored on every elemet so we don't have to
      // look around so much with the jquery selectors...
      var gibletId = event.target.parentNode.attributes.gibletId.value;
      var newTitle = event.target.value;
      var dbTarget = 'taskname';
      Meteor.call('updateGibletValue', gibletId, dbTarget, newTitle);
    },

    'input .keywordInput': function(event) {
      // TODO: this also needs to be cleaned up.
      // No referencing parent nodes !!
      var gibletId = event.target.parentNode.parentNode.attributes.gibletId.value;
      var newKeywords = event.target.value;

      var dbTarget = 'keywords';

      var cleanCommaSeperatedString = function(string) {
        console.log(string);
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
      console.log(keywordArray)
      Meteor.call('updateGibletValue', gibletId, dbTarget, keywordArray);
    },

    'click div.addUrlButton': function(event) {
      console.log('Click Add', event);
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
      console.log('email')
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
    }



  });
}