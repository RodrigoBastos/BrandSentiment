/**
 * Created by rodrigo on 09/07/15.
 */
var fs                    = require("fs");
var tokens                = require("./../ngram/tokenSentences");
var natural               = require('natural');
var keywordExtractor     = require("keyword-extractor");

var extractorOptions = {
  language:"portugueseTwo",
  remove_digits: true,
  return_changed_case:true,
  remove_duplicates: false

};

var arrayNeg = [];
var arrayPos = [];

  //Create classifier
var classifier = new natural.BayesClassifier();

  //Read Files Neagtive and Positive
var negatives = fs.readFileSync("sentences/negatives-sentences.txt", 'utf8').split('\n');
var positives = fs.readFileSync("sentences/positives-sentences.txt", "utf8").split('\n');


var sentence = null;


//Push negatives cases in classifier
for(var i = 0; i < 300;i++){
  //Stopwords
  //console.log('Text', negatives[i]);
  sentence = keywordExtractor.extract(negatives[i], extractorOptions);
  console.log('keywords', sentence);
  var trigramsNegative = [sentence.join(' ')];
  if(sentence.length > 2)
    trigramsNegative = tokens.textToTrigram(sentence.join(' '));
 // var trigramsNegative = tokens.textToTrigram(sentence);
 // console.log('trigram', trigramsNegative);
  trigramsNegative.map(function(trigram){
    arrayNeg.push(trigram);
    classifier.addDocument(trigram, 'negative');
  });
}

//Push positves cases in Classifier
for(i = 0; i < positives.length; i++){

  //console.log('Text', positives[i]);
  sentence = keywordExtractor.extract(positives[i], extractorOptions);
  //console.log('keywords', sentence);
  var trigramsPositive = [sentence.join(' ')];
  if(sentence.length > 2)
    trigramsPositive = tokens.textToTrigram(sentence.join(' '));
  //var trigramsPositive = tokens.textToTrigram(sentence);
  //console.log('trigram', trigramsPositive);
  trigramsPositive.map(function(trigram){
    arrayPos.push(trigram);
    classifier.addDocument(trigram, 'positive');
  });

}

//Train
classifier.train();

//var sentenceTrigram = tokens.textToTrigram(sentence);

//Test
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
  console.log('objectSentiment - Text', sentence);
  sentence = keywordExtractor.extract(sentence, extractorOptions);

  var trigrams = [sentence];
  if(sentence.length > 2)
    trigrams = tokens.textToTrigram(sentence.join(' '));

  console.log('objectSentiment - keywords', trigrams);
  var scorePos = 0;
  var scoreNeg = 0;


  trigrams.map(function(trigram, index){
    console.log('trigram '+index+': ', trigram);

    var obj = classifier.getClassifications(trigram);

    obj.map(function(item){
      if(item.label == 'positive')
        scorePos += item.value;

      if(item.label == 'negative')
        scoreNeg += item.value;
    });
  });

  console.log('SOCRE POSITIVE: ', scorePos);
  console.log('SOCRE NEGATIVE: ', scoreNeg);

  if(scorePos > scoreNeg)
    return 'positive';

  return 'negative';
};


module.exports = {
  classify: classifySentiment,
  object: objectSentiment
};
