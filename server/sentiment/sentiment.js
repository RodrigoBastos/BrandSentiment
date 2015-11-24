/**
 * Created by rodrigo on 09/07/15.
 */
var _                     = require('lodash');
var fs                    = require("fs");
var tokens                = require("./../ngram/tokenSentences");
var natural               = require('natural');
var keywordExtractor      = require("keyword-extractor");


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
var neutras = fs.readFileSync("sentences/neutros-sentences.txt", "utf8").split('\n');


var sentence = null;


//Push negatives cases in classifier
for(var i = 0; i < negatives.length; i++){
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

//Push positves cases in Classifier
for(i = 0; i < neutras.length; i++){

  //console.log('Text', positives[i]);
  sentence = keywordExtractor.extract(neutras[i], extractorOptions);
  //console.log('keywords', sentence);
  var trigramsNeutra = [sentence.join(' ')];
  if(sentence.length > 2)
    trigramsNeutra = tokens.textToTrigram(sentence.join(' '));
  //var trigramsPositive = tokens.textToTrigram(sentence);
  //console.log('trigram', trigramsPositive);
  trigramsNeutra.map(function(trigram){
    arrayPos.push(trigram);
    classifier.addDocument(trigram, 'neutra');
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
  var scoreNtr = 0;


  trigrams.map(function(trigram, index){
    console.log('trigram '+index+': ', trigram);

    var obj = classifier.getClassifications(trigram);

    obj.map(function(item){
      if(item.label == 'positive')
        scorePos += item.value;

      if(item.label == 'negative')
        scoreNeg += item.value;

      if(item.label == 'neutra')
        scoreNtr += item.value;
    });
  });

  console.log('SOCRE POSITIVE: ', scorePos);
  console.log('SOCRE NEGATIVE: ', scoreNeg);

  if(scorePos > scoreNeg && scorePos > scoreNtr)
    return 'positive';

  else if(scoreNeg > scorePos && scoreNeg > scoreNtr)
    return 'negative';

  else
    return 'neutra';
};

var scoreSentiment = function (sentence) {

  console.log('sentence :', sentence);
  sentence = keywordExtractor.extract(sentence, extractorOptions);
  var score = [];
  console.log('keyword :', sentence);

  var trigrams = [sentence];
  if(sentence.length > 2)
    trigrams = tokens.textToTrigram(sentence.join(' '));

  console.log('trigrams :', trigrams);


  trigrams.map(function(trigram, index){
    var obj = classifier.getClassifications(trigram);
    score.push({trigram: JSON.stringify(trigram), classify: JSON.stringify(obj)});
  });

  return score;
};


function removeLinksAndUsername (sentence) {
  var words = sentence.split(' ');
  var result = words.map(function(word){
    //console.log('include: ', _.include(word, 'https://'));
    if(!_.include(word, 'https://') && !_.include(word, '@'))
      return word;
  });

  return result.join(' ');
}

function cleanSentence (sentence){

  return sentence.replace(/(\?)+/, '?')
    .replace(/(\.)+/, '.')
    .replace(/(\!)+/, '!')
    .replace(/(\))+/, ')')
    .replace(/(\()+/, '(')
  ;

}

var getSentiment = function (sentence) {

  sentence = cleanSentence(sentence);
  //console.log('Sem repetidos: ', sentence);
  sentence = removeLinksAndUsername(sentence);
  //console.log('Sem links: ', sentence);

  sentence = keywordExtractor.extract(sentence, extractorOptions).join(' ');

  var obj = classifier.getClassifications(sentence);
  var result = classifier.classify(sentence);

  //console.log(obj);
  var score = _(obj)
    .filter(function(item) { return item.label == result; })
    .pluck('value')
    .value();

  if(result != 'neutra'){
    var negative = _(obj)
      .filter(function(item) { return item.label == 'negative'; })
      .pluck('value')
      .value();

    var postivie = _(obj)
      .filter(function(item) { return item.label == 'positive'; })
      .pluck('value')
      .value();

    var neutra = _(obj)
      .filter(function(item) { return item.label == 'neutra'; })
      .pluck('value')
      .value();

    //console.log(negative);
    var distance = parseFloat(postivie) - parseFloat(negative);
    if(result == 'negative')
        distance =parseFloat(negative) - parseFloat(postivie);

    //console.log(distance);
    var scoreNtr = distance + neutra.value;

    if(parseFloat(neutra) > distance){
      score = parseFloat(neutra) ;
      result = 'neutra';
      console.log('Regra da Distancia');
    }
  }

  return {result: result, score: parseFloat(score)};
};

console.log(getSentiment('Estou triste com você!'));

module.exports = {
  classify: classifySentiment,
  object: objectSentiment,
  score: scoreSentiment,
  sentimet: getSentiment
};
