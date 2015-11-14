/**
 * Created by rodrigo on 09/07/15.
 */
var fs        = require("fs");
var natural   = require('natural');


var tokens = require("./../ngram/tokenSentences");
var sentence = "Eu estou feliz!";

function loads (){
  //Create classifier
  var classifier = new natural.BayesClassifier();

  //Read Files Neagtive and Positive
  var negatives = fs.readFileSync("sentences/negatives-sentences.txt", 'utf8').split('\n');
  var positives = fs.readFileSync("sentences/positives-sentences.txt", "utf8").split('\n');

  var arrayNeg = [];
  var arrayPos = [];

  //Push negatives cases in classifier
  for(var i = 0; i < negatives.length;i++){
    var trigramsNegative = tokens.textToTrigram(negatives[i]);

    trigramsNegative.map(function(trigram){
      arrayNeg.push(trigram);
      classifier.addDocument(trigram, 'negative');
    });
  }

  //Push positves cases in Classifier
  for(i = 0; i < positives.length; i++){

    var trigramsPositive = tokens.textToTrigram(positives[i]);

    trigramsPositive.map(function(trigram){
      arrayPos.push(trigram);
      classifier.addDocument(trigram, 'positive');
    });

  }

  console.log(arrayNeg.length);
  console.log(arrayPos.length);

  //console.log(arrayPos);

  //Train
  classifier.train();

  //Test
  console.log(classifier.classify(sentence));
  console.log(classifier.getClassifications(sentence));

}

loads();