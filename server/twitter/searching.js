/**
 * Created by rodrigo on 10/11/15.
 */
var fs  = require('fs');
var twitterClient = require('../config/index.js').twitterClient;


var keywords = ['Amor', 'Felicidade', 'Alegria', 'Muito bom', 'ótimo', 'Maravilhoso'];

//Stream Twitter by Search
for(var i=0; i < keywords.length; i++){
  twitterClient.get('search/tweets', { q: keywords[i], lang: 'pt', retweet: false }, getSentences);
}

function getSentences (error, tweets, response) {

  var obj = tweets.statuses;

  var sentences = [];

  for (var i = 0; i < obj.length; i++){
    console.log(obj[i].text);
    sentences.push(obj[i].text);
  }

  var phrases = '\n'+ sentences.join('\n');

  fs.appendFile('sentences.txt', phrases, function(err) {
    if (err) throw err;
  });
}