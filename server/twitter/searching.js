/* eslint no-unused-vars: [2, { "args": "none" }] */
var fs = require('fs');
var twitterClient = require('../config/index.js').twitterClient;

// Palavras-chaves
var keywords = ['Google', 'Apple', 'Microsoft'];

function getSentences(error, tweets, response) {
  var obj = tweets.statuses;
  var sentences = obj.map(function (item) {
    return item.text;
  }).join('\n');

  var phrases = '\n' + sentences;
  fs.appendFile('sentences.txt', phrases, function (err) {
    if (err) throw err;
  });
}

// Cria Stream do Twitter por pesquisar
keywords.forEach(function (keyword) {
  twitterClient.get('search/tweets', { q: keyword, lang: 'pt', retweet: false }, getSentences);
});
