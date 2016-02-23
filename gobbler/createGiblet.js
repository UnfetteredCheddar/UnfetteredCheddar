if (Meteor.isServer) {
  Meteor.methods({

    addUrlToArray: function(id) {
      console.log('add url to array server side!');
      console.log('Add url to array!');
      var giblet = Giblets.findOne({'_id': id});
      console.log(giblet);
      var urlArray = giblet.url;
      console.log('Url array: ', urlArray, urlArray.length);
      urlArray[urlArray.length] = undefined;

      Giblets.update({'_id': id}, {$set: {url: urlArray}});
      var newGiblet = Giblets.findOne({'_id': id});
      console.log('Update happens!', newGiblet);   
    }
    
  });
}

if (Meteor.isClient) {

  Template.giblet.events({
    'click .addUrlButton': function(event) {
      // code goes here
      console.log('Click Add', event);
      // console.log(event.currentTarget.classList[1]);
      var id = event.target.attributes['mongoid'].value;
      console.log('id from button', id);

      Meteor.call('addUrlToArray', id);
    },

    'click .subtractUrlButton': function(event) {
      console.log('Click Subtract', event)
    }
  });
}