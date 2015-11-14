/**
 * Created by rodrigo on 06/07/15.
 */

var fs = require('fs');
var twitterClient = require('../config/index.js').twitterClient;

var keywords = ['paz', 'amor', 'felicidade', 'gosto muito', 'carinho', 'gentileza'];


var stream = twitterClient.stream('statuses/filter', { track: keywords });

var count = 0;
var tweets = [];

stream.on('tweet', onTwitter);

function onTwitter (tweet) {
  console.log(tweet.text);
  var size = tweet.text.split(' ').length;

  if (size < 6){
    tweets.push(tweet.text);
    count++;
  }

  if (count == 50) {
    stream.stop();
    onDone();
  }

}

function onDone () {
  console.log(tweets);

  var phrases = '\n'+ tweets.join('\n');

  fs.appendFile('sentences.txt', phrases, function(err) {
    if (err) throw err;
  });
}



