/**
 * Created by rodrigo on 06/07/15.
 */

var fs = require('fs');
var Twit = require('twit');
var oauth = require('../utils/twitter_credentials.js');

var keywords = ['triste', 'raiva', 'assustador'];

var client = new Twit(oauth);

var stream = client.stream('statuses/filter', { track: keywords });

var count = 0;
var tweets = [];

stream.on('tweet', onTwitter);


function onTwitter (tweet) {
  //console.log(tweet.text);
  var size = tweet.text.split(' ').length;

  if (size < 5){
    tweets.push(tweet.text);
    console.log(tweet.text);
    count++;
  }

  if (count == 100) {
    stream.stop();
    onDone();
  }

}

function onDone () {
  console.log(tweets);
}



