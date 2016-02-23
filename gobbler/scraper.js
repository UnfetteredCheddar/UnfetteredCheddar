if (Meteor.isServer) {
  Meteor.methods({
    scrapePage: function ( url ) {
      var webpage = Scrape.website(url);
      var webpageText = webpage.text;
      var hash = Meteor.call('hashText', webpageText);
      Meteor.call('checkPageUpdates', url, hash, webpageText);
    },
    checkPageUpdates: function( url, hash, pageText ) {
      var giblets = Giblets.find({url: url});
      giblets.forEach( function( giblet ) {
        if ( giblet.hash !== hash ) {
          if ( giblet.fullText !== pageText ) {
            Meteor.call('updateSingleGiblet', giblet._id, hash, pageText);
            console.log(' updated giblet: ', Giblets.find({_id: giblet._id}).fetch());
          }
        }
      });
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
