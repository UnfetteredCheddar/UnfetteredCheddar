Meteor.methods({
  scrapePage: function ( url ) {
    var result = Meteor.http.get( url );
    var $ = cheerio.load(result.content);
    console.log( $ );
  }
});
