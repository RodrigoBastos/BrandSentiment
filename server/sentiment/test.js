var fs                    = require("fs");
var analysisSentiment     = require("./sentiment.js");

var negativeSentences = [
  "Eu te odeio",
  "Estou com muita raiva hoje",
  "A sua morte foi horrível",
  "Ela está triste e chorando",
  "Eu vou morrer!",
  "Enquanto uns fazem contagem para o natal, eu faço para Star Wars.",
  "unfollow em quem fica comparando jogos vorazes e star wars",
  "quero ganhar a cortesia: 'Star Wars: Uma Nova Esperança' https://t.co/luNiOohLfe #skoob",
  "Star Wars: O desperta da força já tá no mesmo nivel de revelações q o trailer de Age of Ultron tiveram"

];

var positiveSentences = [
  "Eu te amo muito",
  "Estou muito feliz hoje",
  "Que notícia maravilhosa",
  "Ela está alegre e contente",
  "Eu gosto muito de você",
  "Obrigado por tudo!",
  "não estou triste"
];

negativeSentences.map(function(sentence){
  var result = analysisSentiment.sentimet(sentence);
  console.log(result);
});

