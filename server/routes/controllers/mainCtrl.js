/**
 * Created by rodrigo on 05/07/15.
 */
var twitterClient = require('../../config/index.js').twitterClient;

exports.getIndex = function (req, res) {
  res.render('index');
};

exports.getWatchTwitter = function (req, res) {
  var stream;
  var testTweetCount = 0;
  var phrase = 'bieber';
  // var phrase = 'ice cream';

  stream = twitterClient.stream('statuses/filter', { track: phrase });
  res.send("Monitoring Twitter for \'" + phrase + "\'...  Logging Twitter traffic.");
  stream.on('tweet', function (tweet) {
    testTweetCount++;
    if(testTweetCount % 10 === 0){
      console.log("Tweet #" + testTweetCount + ":  " + tweet);
    }
  });

    //stream = twitterClient.stream('statuses/filter', {
    //  'track': phrase
    //}, function (stream) {
    //  res.send("Monitoring Twitter for \'" + phrase + "\'...  Logging Twitter traffic.");
    //  stream.on('data', function (data) {
    //    testTweetCount++;
    //    // Update the console every 50 analyzed tweets
    //    if (testTweetCount % 10 === 0) {
    //      console.log("Tweet #" + testTweetCount + ":  " + data.text);
    //    }
    //  });
    //});

};