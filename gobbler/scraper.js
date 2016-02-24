if (Meteor.isServer) {
  Meteor.methods({
    runGiblet: function ( urls, gibletID ) {
      var giblet = Giblets.findOne({_id: gibletID});
      urls.forEach( function ( url, urlIndex ) {
        var webpageText = scrapePage(url);
        var hash = hashText(webpageText);
        var pageChanged = compareHash(giblet, url, hash);
        if (pageChanged) {
          var newKeywordObj = findKeywords(giblet.keywords, webpageText);
          var keywordChanges = Meteor.call('compareKeywordObjects', gibletID, newKeywordObj, url);
          if (keywordChanges.length) {
            Meteor.call('createNotification', gibletID, keywordChanges, url, giblet.owner);
          }
          Meteor.call('updateSingleGiblet', gibletID, url, hash, newKeywordObj);
        }
      });
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
