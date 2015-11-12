/**
 * Created by rodrigo on 09/07/15.
 */
var fs        = require("fs");
var natural   = require('natural');


var tokens = require("./../ngram/tokenSentences");


function loads (){
  //Create classifier
  var classifier = new natural.BayesClassifier();

  //Read Files Neagtive and Positive
  var negatives = fs.readFileSync("public/files/negatives.txt", 'utf8').split('\n');
  var positives = fs.readFileSync("public/files/positives.txt", "utf8").split('\n');

  var arrayNeg = [];
  var arrayPos = [];

  //Push negative's cases in classifier
  for(var i = 0; i < negatives.length;i++){
    var trigramsNegative = tokens.textToTrigram(negatives[i]);

    trigramsNegative.map(function(trigram){
      arrayNeg.push(trigram);
      classifier.addDocument(trigram, 'negative');
    });
  }

  //Push positve's cases in Classifier
  for(i = 0; i < positives.length; i++){

    var trigramsPositive = tokens.textToTrigram(positives[i]);

    trigramsPositive.map(function(trigram){
      arrayPos.push(trigram);
      classifier.addDocument(trigram, 'positive');
    });

  }

  console.log(arrayNeg.length);
  console.log(arrayPos.length);

  console.log(arrayPos);

  //Train
  classifier.train();

  //Test
  console.log(classifier.classify("Ele está triste"));

}

loads();