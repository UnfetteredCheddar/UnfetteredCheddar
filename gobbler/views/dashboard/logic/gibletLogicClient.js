if (Meteor.isClient) {

  // Call addGiblet when plus sign is clicked
  Template.big_plus.events({
    'click .big_plus_div': function ( event ) {
      event.preventDefault();
      Meteor.call('addGiblet');
    }
  });

  // Populate giblets as user fill outs form
  Template.giblet.events({
    'change .gibletTitleInput': function ( event ) {
      var gibletId = event.currentTarget.form.attributes['gibletID'].value;
      var newTitle = event.currentTarget.value;
      Meteor.call('updateTitle', gibletId, newTitle);
    },
    'change .urlTextInput': function ( event ) {
      var id = event.currentTarget.form.attributes['gibletID'].value;
      var urlIndex = event.currentTarget.parentNode.attributes['urlIndex'].value;
      var value = event.target.value;
      Meteor.call('modifyUrlInArray', id, urlIndex, value);
    },
    'click div.addUrlButton': function ( event ) {
      var id = event.currentTarget.attributes['gibletID'].value;
      Meteor.call('addUrlToArray', id);
    },
    'click div.subtractUrlButton': function ( event ) {
      var id = event.currentTarget.attributes['gibletID'].value;
      var urlIndex = event.currentTarget.attributes['urlindex'].value;
      Meteor.call('removeUrlFromArray', id, urlIndex);
    },
    'change .keywordInput': function ( event ) {
      var id = event.currentTarget.form.attributes['gibletID'].value;
      var newKeywords = event.currentTarget.value;
      var keywordArray = newKeywords.split(',');
      Meteor.call('updateKeywordArray', id, keywordArray);
    },
    'change .cronJobTimer': function ( event ) {       
      var id = event.currentTarget.form.attributes['gibletID'].value;
      var input = event.currentTarget.value;
      console.log('cron change', id, input);
      if (!input) {
        input = undefined;
      }
      Meteor.call('updateCronTimer', id, input);
    },
    'click .smsStatus': function ( event ) {
      var id = event.currentTarget.form.attributes['gibletID'].value;
      Meteor.call('toggleSmsStatus', id);
    },
    'click .emailStatus': function ( event ) {
      var id = event.currentTarget.form.attributes['gibletID'].value;
      Meteor.call('toggleEmailStatus', id);
    },
    'click .gibletRunningStatusForm': function ( event ) {
      var id = event.currentTarget.form.attributes['gibletID'].value;      
      Meteor.call('toggleGibletRunningStatus', id);
    },
    'click .removeGibletButton': function ( event ) {
      var id = event.currentTarget.attributes['gibletID'].value;
      Meteor.call('removeGiblet', id);
    }
  });
}
