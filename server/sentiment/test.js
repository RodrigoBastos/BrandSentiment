/**
 * Created by rodrigo on 18/11/15.
 */

var fs                    = require("fs");
var analysisSentiment     = require('./sentiment.js');


var negativeSentences = [
  'Eu te odeio',
  'Estou com muita raiva hoje',
  'A sua morte foi horrível',
  'Ela está triste e chorando',
  'Eu vou morrer!'
];

var positiveSentences = [
  'Eu te amo muito',
  'Estou muito feliz hoje',
  'Que notícia maravilhosa',
  'Ela está alegre e contente',
  'Eu vou ganhar o jogo!'
];



negativeSentences.map(function(sentence){
  var result = analysisSentiment.object(sentence);
  console.log(sentence+' : ', result);
});

