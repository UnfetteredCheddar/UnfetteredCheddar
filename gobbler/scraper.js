if (Meteor.isServer) {
  Meteor.methods({
    scrapePage: function ( url ) {
      var webpage = Scrape.website(url);
      var webpageText = webpage.text;
      var hash = Meteor.call('hashText', webpageText);
      var giblets = Giblets.find({url: url});

      giblets.forEach( function( giblet ) {
        if ( giblet.hash !== hash ) {
          if ( giblet.fullText !== webpageText ) {
            Meteor.call('updateSingleGiblet', giblet._id, hash, webpageText);
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
