if (Meteor.isServer) {
  Meteor.methods({
    scrapePage: function ( url, gibletID ) {
      var webpage = Scrape.url(url);
      var $ = cheerio.load(webpage);
      $('script').remove();
      var webpageText = $('body').text().replace(/\n/g, ' ').replace(/\t/g, ' ').replace('  ', ' ');
      var hash = Meteor.call('hashText', webpageText);
      Meteor.call('checkPageUpdates', gibletID, hash, webpageText);
    },
    checkPageUpdates: function( gibletID, hash, pageText ) {
      var giblet = Giblets.findOne({_id: gibletID});
      if ( giblet.hash !== hash ) {
        Meteor.call('updateSingleGiblet', giblet._id, hash, pageText);
      }
    },
    updateSingleGiblet: function( id, hash, pageText ) {
      Giblets.update({_id: id}, 
        {$set: {
          hash: hash,
          fullText: pageText
        }
      });
      Meteor.call('findKeywords', id, pageText);
    },
    hashText: function ( pageText ) {
      return CryptoJS.SHA1(pageText).toString();
    },
    findKeywords: function( gibletID, pageText ) {
      var giblet = Giblets.findOne({_id: gibletID});
      var goodTags = Tags.clean( giblet.keywords );

      // convert tags to case-insensitive regular expressions
      var tagRegexArr = [];
      goodTags.forEach( function( tag ) {
        tagRegexArr.push( new RegExp(tag, 'gi'));
      });

      var foundKeywords = [];
      tagRegexArr.forEach( function( tagRegex ) {
        var matchingArr = pageText.match(tagRegex);
        foundKeywords = foundKeywords.concat( matchingArr );
      });

      return foundKeywords.length;
    }
  });
}
