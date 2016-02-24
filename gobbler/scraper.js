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
        var keywordObj = Meteor.call('findKeywords', giblet._id, pageText);
        var oldKeywords = giblet.keywordCounts || {};
        var notificationKeys = [];
        for (var key in keywordObj) {
          if (!(key in oldKeywords) || keywordsObj[key] > oldKeywords[key]) {
            notificationKeys.push(key);
          }
        }
        Meteor.call('createNotification', giblet._id, notificationKeys, giblet.url, giblet.owner);
        Meteor.call('updateSingleGiblet', giblet._id, hash, keywordObj);
      }
    },
    updateSingleGiblet: function( id, hash, keywordObj ) {
      Giblets.update({_id: id}, 
        {$set: {
          hash: hash,
          keywordCounts: keywordObj
        }
      });
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
        foundKeywords.push( matchingArr );
      });
      var keywords = {}
      foundKeywords.forEach(function(array) {
        if (array) {
          keywords[array[0]] = array.length;
        }
      });
      console.log(keywords);
      return keywords;
    },
    createNotification: function(gibletID, notificationKeys, url, owner) {
      Notifications.insert({
        createdAt: new Date(),
        owner: owner,
        giblet: gibletID,
        keywords: notificationKeys,
        url: url
        // SMS: giblet.SMS,
        // email: giblet.email,
      });
    }
  });
}
