/**
 * Created by rodrigo on 10/11/15.
 */

var twitterClient = require('../config/index.js').twitterClient;

var stream = twitterClient.get('search/tweets', { q: 'morte' }, getSentences);

function getSentences (error, tweets, response) {

  var obj = tweets.statuses;

  for (var i = 0; i < obj.length; i++){
    console.log(obj[i].text);
  }
}