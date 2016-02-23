if (Meteor.isClient) {

  var addUrlToArray = function(id) {

    Meteor.call(addUrlToArray, id);

  };

  Template.giblet.events({
    'click .addUrlButton': function(event) {
      // code goes here
      console.log('Click Add', event);
      // console.log(event.currentTarget.classList[1]);
      var id = event.target.attributes['mongoid'].value;
      console.log('id from button', id);
      addUrlToArray(id);

    },

    'click .subtractUrlButton': function(event) {
      console.log('Click Subtract', event)
    }
  });
}

if (Meteor.isServer) {
  Meteor.methods({

    addUrlToArray: function(id) {
      console.log('Add url to array!');
      var giblet = Giblets.findOne({'_id': id});
      console.log(giblet);
      var urlArray = giblet.url;
      console.log('Url array: ', urlArray, urlArray.length);
      urlArray[urlArray.length] = 'test';

      Giblets.update({'_id': id}, {$set: {url: urlArray}});
      var newGiblet = Giblets.findOne({'_id': id});
      console.log('Update happens!', newGiblet);      
    }
    
  });
}