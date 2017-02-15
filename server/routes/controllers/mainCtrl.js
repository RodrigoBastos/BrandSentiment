var twitterClient = require('../../config/index.js').twitterClient;

exports.getIndex = function (req, res) { res.render('index'); };

exports.getWatchTwitter = function (req, res) {
  var stream;
  var testTweetCount = 0;
  var phrase = 'bieber';

  stream = twitterClient.stream('statuses/filter', { track: phrase });
  res.send('Monitoring Twitter for \'' + phrase + '\'...  Logging Twitter traffic.');
  stream.on('tweet', function (tweet) {
    testTweetCount += 1;
    if (testTweetCount === 10) {
      res.send(tweet.text);
      console.log('Tweet #' + testTweetCount + ':  ' + tweet.text);
    }
  });
};
