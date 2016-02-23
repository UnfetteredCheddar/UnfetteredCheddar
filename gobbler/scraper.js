if (Meteor.isServer) {
  Meteor.methods({
    scrapePage: function ( url, gibletID ) {
      var webpage = Scrape.url(url);
      var webpageText = webpage.toString();
      // var webpageText = webpage.text + webpage.references;
      var hash = Meteor.call('hashText', webpageText);
      Meteor.call('checkPageUpdates', gibletID, hash, webpageText);
    },
    checkPageUpdates: function( gibletID, hash, pageText ) {
      var giblet = Giblets.findOne({_id: gibletID});
      if ( giblet.hash !== hash ) {
        Meteor.call('updateSingleGiblet', giblet._id, hash, pageText);
        console.log(' updated giblet: ', Giblets.find({_id: giblet._id}).fetch());
      }
    },
    updateSingleGiblet: function( id, hash, pageText ) {
      Giblets.update({_id: id}, 
        {$set: {
          hash: hash,
          fullText: pageText
        }
      });
    },
    hashText: function ( pageText ) {
      return CryptoJS.SHA1(pageText).toString();
    }
  });
}
