if (Meteor.isServer) {
  Meteor.methods({
    scrapePage: function ( url ) {
      var webpage = Scrape.website(url);
      var webpageText = webpage.text;
      console.log( webpageText );
    }
  });
}
