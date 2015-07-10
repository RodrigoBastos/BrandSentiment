/**
 * Created by rodrigo on 06/07/15.
 */
"use strict";

var Twit = require('twit');
var oauth = require('../config/twitter_credentials.js');

var keywords = ['feliz'];

var client = new Twit(oauth);

var stream = client.stream('statuses/filter', { track: keywords });

var count = 0;
var tweets = [];

stream.on('tweet', onTwitter);


function onTwitter (tweet) {
  //console.log(tweet.text);
  tweets.push(tweet.text);
  if (count == 50){
    stream.stop();
    onDone();
  }
  count++;
}

function onDone () {
  console.log(tweets);
}