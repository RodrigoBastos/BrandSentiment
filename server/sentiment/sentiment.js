/**
 * Created by rodrigo on 09/07/15.
 */
var fs        = require("fs");
var natural   = require('natural');
var tokens = require("./../ngram/tokenSentences");


var arrayNeg = [];
var arrayPos = [];

  //Create classifier
var classifier = new natural.BayesClassifier();

  //Read Files Neagtive and Positive
var negatives = fs.readFileSync("sentences/negatives-sentences.txt", 'utf8').split('\n');
var positives = fs.readFileSync("sentences/positives-sentences.txt", "utf8").split('\n');



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

//Train
classifier.train();

//var sentenceTrigram = tokens.textToTrigram(sentence);
//
////Test
//console.log(classifier.classify(sentence));
//var result = classifier.getClassifications(sentence);
//console.log(result[0].value > result[1].value);
//console.log(classifier.getClassifications(sentence));
//
//sentenceTrigram.map(function(trigram, index){
//  console.log('trigram '+index, trigram);
//  console.log(classifier.classify(trigram));
//  console.log(classifier.getClassifications(trigram));
//});


var classifySentiment = function (sentence) {
  return classifier.classify(sentence);
};

var objectSentiment = function (sentence) {
  return classifier.getClassifications(sentence);
};


module.exports = {
  classify: classifySentiment,
  object: objectSentiment
};
