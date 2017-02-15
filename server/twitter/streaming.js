// Script responsável por extrair tweets com contexto positivo
// ou negativo para alimentar a base de conhecimento
var fs = require('fs');
var twitterClient = require('../config/index.js').twitterClient;

// palavras/expressões com contexto positivo ou negativo
var keywords = [];

// Cria Stream Twitter por filtro
var stream = twitterClient.stream('statuses/filter', { track: keywords });

var count = 0;
var tweets = [];

function onDone() {
  console.log(tweets);
  var phrases = '\n' + tweets.join('\n');
  fs.appendFile('sentences.txt', phrases, function (err) {
    if (err) throw err;
  });
}

function onTwitter(tweet) {
  console.log(tweet.text);
  tweets.push(tweet.text);
  count += 1;

  if (count === 100) {
    stream.stop();
    onDone();
  }
}

stream.on('tweet', onTwitter);

