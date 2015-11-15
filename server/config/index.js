/**
 * Created by rodrigo on 10/11/15.
 */


var Twit = require('twit');
var oauth = require('../twitter/twitter_credentials.js');


module.exports = {
  twitterClient: new Twit(oauth),
  concurrency: process.env.WEB_CONCURRENCY || 1
};