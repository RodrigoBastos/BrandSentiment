/**
 * Created by rodrigo on 10/11/15.
 */


var Twit = require('twit');
var oauth = require('../utils/twitter_credentials.js');


module.exports = {
  twitterClient: new Twit(oauth)
};