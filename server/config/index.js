var Twit = require("twit");
var oauth = require("../twitter/twitter_credentials.js");

// Configurações
module.exports = {
  twitterClient: new Twit(oauth),
  concurrency: process.env.WEB_CONCURRENCY || 1
};