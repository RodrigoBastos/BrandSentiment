/**
 * Created by rodrigo on 09/07/15.
 */
var fs        = require("fs");
var natural   = require('natural');

var tokens = require("./../ngram/tokenSentences");


function loads (){
  var classifier = new natural.BayesClassifier();
  var negatives = fs.readFileSync("public/files/negatives.txt", 'utf8').split('\n');
  var positives = fs.readFileSync("public/files/positives.txt", "utf8").split('\n');
  var arrayNeg = [];
  var arrayPos = [];
  for(var i = 0; i < 100;i++){
    var trigramsNegative = tokens.textToTrigram(negatives[i]);

    trigramsNegative.map(function(trigram){
      arrayNeg.push(trigram);
      classifier.addDocument(trigram, 'negative');
    });
    //classifier.addDocument(negatives[i], 'negative');
  }

  for(i = 0; i < 100; i++){

    var trigramsPositive = tokens.textToTrigram(positives[i]);

    trigramsPositive.map(function(trigram){
      arrayPos.push(trigram);
      classifier.addDocument(trigram, 'positive');
    });
    //classifier.addDocument(positives[i], 'positive');
  }

  console.log(arrayNeg.length);
  console.log(arrayPos.length);

  console.log(arrayPos);
  //loadNegative(1, onResults);
  classifier.train();

  var trigram = tokens.textToTrigram("Conquistamos uma boa vitória");
  console.log(classifier.classify(trigram));

}

loads();





//classifier.addDocument('Eu estou triste', 'negative');
//classifier.addDocument('Eu vou morrer', 'negative');
//classifier.addDocument('Eu não gosto disso', 'negative');
//classifier.addDocument('Eu odeio biscoito', 'negative');
//classifier.addDocument('Eu estou feliz', 'positive');
//classifier.addDocument('Eu vou comer', 'positive');
//classifier.addDocument('Eu gosto de sorvete', 'positive');
//classifier.addDocument('Eu amo feijoada', 'positive');
//
//classifier.train();
//
//console.log(classifier.classify('Ele gosta disso'));