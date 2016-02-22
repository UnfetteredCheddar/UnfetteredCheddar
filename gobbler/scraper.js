Meteor.methods({
  scrapePage: function ( url ) {
    var webpage = Scrape.url(url);
    console.log( webpage );
  }
});
