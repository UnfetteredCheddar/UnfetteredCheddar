if (Meteor.isServer) {
  Meteor.methods({
    // TODO: refactor to handle multiple urls
    scrapePage: function ( urls, gibletID ) {
      urls.forEach( function ( url, urlIndex ) {
        var webpage = Scrape.url(url);
        var $ = cheerio.load(webpage);
        $('script').remove();
        var webpageText = $('body').text().replace(/\n/g, ' ').replace(/\t/g, ' ').replace('  ', ' ');
        var hash = Meteor.call('hashText', webpageText);
        Meteor.call('checkPageUpdates', gibletID, url, hash, webpageText, urlIndex);
      });
    }, 
    checkPageUpdates: function( gibletID, url, hash, pageText, urlIndex ) {
      var giblet = Giblets.findOne({_id: gibletID});
      var regExURL = url.replace(/\./g, '');
      if ( !giblet.webData[regExURL] || giblet.webData[regExURL].hash !== hash ) {
        var keywordObj = Meteor.call('findKeywords', giblet._id, pageText);
        var oldKeywords = giblet.keywordCounts || {};
        var notificationKeys = [];
        for (var key in keywordObj) {
          if ( !(key in oldKeywords) || keywordsObj[key] > oldKeywords[key] ) {
            notificationKeys.push(key);
          }
        }
        Meteor.call('createNotification', giblet._id, notificationKeys, url, giblet.owner);
        Meteor.call('updateSingleGiblet', giblet._id, urlIndex, url, hash, keywordObj);
      }
    },
    updateSingleGiblet: function( id, urlIndex, url, hash, keywordObj ) {
      var gibletUpdates = {
        url: url,
        hash: hash,
        keywordCounts: keywordObj
      };
      var giblet = Giblets.findOne({_id: id});
      var gibletWebData = giblet.webData;
      var regExURL = url.replace(/\./g, '');;
      gibletWebData[regExURL] = gibletUpdates;
      Giblets.update({_id: id}, 
        {$set: {
          webData: gibletWebData
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
      return keywords;
    },
    createNotification: function ( gibletID, notificationKeys, url, owner ) {
      Notifications.insert({
        createdAt: new Date(),
        owner: owner,
        giblet: gibletID,
        keywords: notificationKeys,
        url: url
      });
    },
  });
}

function regExURL( url ) {
  var dots = /\./g;
  return url.replace(/\./g, '');
}
