/**
 * Created by rodrigo on 06/07/15.
 */

//Credentials Object
var twitter_keys = {
  "consumer_key": process.env.CONSUMER_KEY,
  "consumer_secret": process.env.CONSUMER_SECRET,
  "access_token": process.env.ACCESS_TOKEN_KEY,
  "access_token_secret": process.env.ACCESS_TOKEN_SECRET
};

module.exports = twitter_keys;