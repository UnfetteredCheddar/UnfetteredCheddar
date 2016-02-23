if (Meteor.isServer) {
  Meteor.methods({

    updateGibletValue: function(id, key, val) {
      var updateObj = {};
      updateObj[key] = val;
      var updateConfirm = Giblets.update({'_id': id}, {$set: updateObj});
      console.log('Update confirm: ', updateConfirm);
    },

    // addUrlToArray: function(id) {
    //   console.log('add url to array server side!');
    //   console.log('Add url to array!');
    //   var giblet = Giblets.findOne({'_id': id});
    //   console.log(giblet);
    //   var urlArray = giblet.url;
    //   console.log('Url array: ', urlArray, urlArray.length);
    //   urlArray[urlArray.length] = undefined;

    //   Giblets.update({'_id': id}, {$set: {url: urlArray}});
    //   var newGiblet = Giblets.findOne({'_id': id});
    //   console.log('Update happens!', newGiblet);
    // }
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
      var gibletId = event.target.parentNode.attributes.gibletId.value;
      var newTitle = event.target.value;
      var dbTarget = 'taskname';
      Meteor.call('updateGibletValue', gibletId, dbTarget, newTitle);
    },

    'input .'

    'click .addUrlButton': function(event) {
      // code goes here
      console.log('Click Add', event);
      // console.log(event.currentTarget.classList[1]);
      var id = event.target.attributes['mongoid'].value;
      console.log('id from button', id);

      Meteor.call('addUrlToArray', id);
    },

    'click .subtractUrlButton': function(event) {
      console.log('Click Subtract', event);
      var id = event.target.attributes['mongoid'].value;
      var urlIndex = event.target.attributes['urlindex'].value;
      console.log(id, urlIndex);
    },



  });
}