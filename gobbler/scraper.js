if (Meteor.isServer) {
  Meteor.methods({
    runGiblet: function ( urls, gibletID ) {
      var giblet = Giblets.findOne({_id: gibletID});
      urls.forEach( function ( url, urlIndex ) {
        var webpageText = scrapePage(url);
        var hash = hashText(webpageText);
        var pageHasChanged = compareHash(giblet, url, hash);
        if (pageHasChanged) {
          var newKeywordCounts = findKeywords(giblet.keywords, webpageText);
          var keywordDiffs = compareKeywordCounts(giblet, url, newKeywordCounts);
          if (keywordDiffs.length) {
            Meteor.call('createNotification', giblet, url, keywordDiffs);
          }
          Meteor.call('updateWebData', giblet, url, hash, newKeywordCounts);
        }
      }); 
    }, 

    updateWebData: function( giblet, url, hash, keywordObj ) {
      var updatedUrlObj = {
        url: url,
        hash: hash,
        keywordCounts: keywordObj
      };
      var webDataCopy = giblet.webData;
      var urlProp = removeDots( url );
      webDataCopy[urlProp] = updatedUrlObj;

      Giblets.update({_id: giblet._id}, 
        {$set: {
          webData: webDataCopy
        }
      });
    },

    createNotification: function ( giblet, url, notificationKeys) {
      Notifications.insert({
        createdAt: new Date(),
        owner: giblet.owner,
        gibletID: giblet._id,
        keywords: notificationKeys,
        url: url
      });
    }
  });
};

function removeDots( url ) {
  var dots = /\./g;
  return url.replace(/\./g, '');
};

function scrapePage(url) {
  var webpage = Scrape.url(url);
  var $ = cheerio.load(webpage);
  $('script').remove();
  var webpageText = $('body').text().replace(/\n/g, ' ').replace(/\t/g, ' ').replace('  ', ' ');
  return webpageText;
};

function hashText( pageText ) {
  return CryptoJS.SHA1(pageText).toString();
};

function compareHash( giblet, url, newHash ) {
  var urlProp = removeDots( url );
  return ( !giblet.webData[urlProp] || giblet.webData[urlProp].hash !== newHash );
};

function findKeywords( keywordsArray, pageText ) {
  var cleanTags = Tags.clean( keywordsArray );
  // convert tags to case-insensitive regular expressions
  var tagRegexArr = [];
  cleanTags.forEach( function( tag ) {
    tagRegexArr.push( new RegExp(tag, 'gi'));
  });

  var foundKeywords = [];
  tagRegexArr.forEach( function( tagRegex ) {
    var matchingArr = pageText.match(tagRegex);
    foundKeywords.push( matchingArr );
  });

  var keywordsObj = {}
  foundKeywords.forEach(function(array) {
    if (array) {
      keywordsObj[array[0]] = array.length;
    }
  });

  return keywordsObj;
}; 

function compareKeywordCounts(giblet, url, newKeywordCounts) {
  var urlProp = removeDots( url );
  var oldKeywordCounts = {};
  if (giblet.webData[urlProp]) {
    oldKeywordCounts = giblet.webData[urlProp].keywordCounts;
  }
  var keywordDiffs = [];
  for (var key in newKeywordCounts) {
    if ( !(key in oldKeywordCounts) || newKeywordCounts[key] > oldKeywordCounts[key] ) {
      keywordDiffs.push(key);
    }
  }
  return keywordDiffs;
};
