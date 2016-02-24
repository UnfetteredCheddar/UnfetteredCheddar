if (Meteor.isServer) {
  Meteor.methods({
    scrapePage: function ( urls, gibletID ) {
      var giblet = Giblets.findOne({_id: gibletID});
      urls.forEach( function ( url, urlIndex ) {
        var webpage = Scrape.url(url);
        var $ = cheerio.load(webpage);
        $('script').remove();
        var webpageText = $('body').text().replace(/\n/g, ' ').replace(/\t/g, ' ').replace('  ', ' ');
        var hash = Meteor.call('hashText', webpageText);
        var pageChanged = Meteor.call('compareHash', gibletID, url, hash);
        if (pageChanged) {
          var newKeywordObj = Meteor.call('findKeywords', gibletID, webpageText);
          var keywordChanges = Meteor.call('compareKeywordObjects', gibletID, newKeywordObj, url);
          if (keywordChanges.length) {
            Meteor.call('createNotification', gibletID, keywordChanges, url, giblet.owner);
          }
          Meteor.call('updateSingleGiblet', gibletID, url, hash, newKeywordObj);
        }
      });
    }, 

    compareHash: function( gibletID, url, hash ) {
      var giblet = Giblets.findOne({_id: gibletID});
      var urlProp = removeDots( url );
      return ( !giblet.webData[urlProp] || giblet.webData[urlProp].hash !== hash );
    },

    compareKeywordObjects: function (gibletID, newKeywordObj, url) {
      var giblet = Giblets.findOne({_id: gibletID});
      var urlProp = removeDots( url );
      var oldKeywords = {};
      if (giblet.webData[urlProp]) {
        oldKeywords = giblet.webData[urlProp].keywordCounts;
      }
      var notificationKeys = [];
      for (var key in newKeywordObj) {
        if ( !(key in oldKeywords) || newKeywordObj[key] > oldKeywords[key] ) {
          notificationKeys.push(key);
        }
      }
      return notificationKeys;
    },

    updateSingleGiblet: function( id, url, hash, keywordObj ) {
      var gibletUpdates = {
        url: url,
        hash: hash,
        keywordCounts: keywordObj
      };

      var giblet = Giblets.findOne({_id: id});
      var gibletWebData = giblet.webData;
      var urlProp = removeDots( url );
      gibletWebData[urlProp] = gibletUpdates;

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
    }
  });
}

function removeDots( url ) {
  var dots = /\./g;
  return url.replace(/\./g, '');
}
