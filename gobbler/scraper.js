if (Meteor.isServer) {
  Meteor.methods({
    scrapePage: function ( url ) {
      var webpage = Scrape.website(url);
      var webpageText = webpage.text;
      var hash = Meteor.call( 'hashText', webpageText );
      Meteor.call('updateGiblets', url, hash, webpageText );
    },
    // TODO: only call update when necessary because it takes a long time
    updateGiblets: function( url, hash, pageText ) {
      Giblets.update({url: url},
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
