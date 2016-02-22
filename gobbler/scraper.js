if (Meteor.isServer) {
  Meteor.methods({
    scrapePage: function ( url ) {
      var webpage = Scrape.website(url);
    }
  });
}
