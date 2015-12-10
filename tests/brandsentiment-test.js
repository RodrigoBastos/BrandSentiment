/**
 * Created by rodrigo on 29/11/15.
 */

var _                     = require('lodash');
var fs                    = require('fs');
var tokens                = require("../server/ngram/tokenSentences");
var natural               = require('natural');
var keywordExtractor      = require("keyword-extractor");

//Create classifierBayes
var classifierBayes = new natural.BayesClassifier();

var extractorOptions = {
  language:"portugueseTwo",
  remove_digits: true,
  return_changed_case:true,
  remove_duplicates: false
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

function preClassify (sentences){

  var test = [];
  var train = [];

  for(var i = 0; i < sentences.length; i++){
    if (i < 50)
      test.push(sentences[i]);
    else
      train.push(sentences[i]);
  }

  return {test: test, train: train};
}

function generateDocument (sentences, label) {

  var total = 0;

  for(var i = 0; i < sentences.length; i++){

    //Stopwords
    var sentence = cleanSentence(sentences[i].toLowerCase());
    sentence = removeLinksAndUsername(sentence);
    sentence = keywordExtractor.extract(sentence, extractorOptions);

    var ngrams = [sentence.join(' ')];
    if(sentence.length > 2)
      ngrams = tokens.textToTrigram(sentence.join(' '));
    else if (sentence.length == 2)
      ngrams = tokens.textToBigram(sentence.join(' '));


    ngrams.map(function(item){
      if(item.length > 1 && item instanceof Array){
        total++;
        classifierBayes.addDocument(item, label);
      }

    });
  }

}

var sentencesNegatives = fs.readFileSync("sentences/negatives-sentences.txt", 'utf8').split('\n');
var sentencesPositives = fs.readFileSync("sentences/positives-sentences.txt", "utf8").split('\n');
var sentencesNeutras = fs.readFileSync("sentences/neutros-sentences.txt", "utf8").split('\n');

var negatives = preClassify(sentencesNegatives);
var positives = preClassify(sentencesPositives);
var neutras = preClassify(sentencesNeutras);

generateDocument(negatives.train, 'negative');
generateDocument(positives.train, 'positive');
generateDocument(neutras.train, 'neutra');

classifierBayes.train();

var getSentimentNgram = function (sentence) {
  sentence = cleanSentence(sentence.toLowerCase());
  sentence = removeLinksAndUsername(sentence);

  sentence = keywordExtractor.extract(sentence, extractorOptions);

  var ngrams = [sentence.join(' ')];
  if(sentence.length > 2)
    ngrams = tokens.textToTrigram(sentence.join(' '));
  else if (sentence.length == 2)
    ngrams = tokens.textToBigram(sentence.join(' '));

  var classification = {
    result: '',
    score: 0
  };

  ngrams.map(function(item){
    var obj = classifierBayes.getClassifications(item);
    var result = classifierBayes.classify(item);

    var value = _(obj)
      .filter(function(item) { return item.label == result; })
      .pluck('value')
      .value();

    if(value > classification.score){
      classification.score = value;
      classification.result = result;
    }


  });

  return classification;

};

var getSentiment = function (sentence) {

  sentence = cleanSentence(sentence.toLowerCase());
  sentence = removeLinksAndUsername(sentence);

  sentence = keywordExtractor.extract(sentence, extractorOptions).join(' ');

  var obj = classifierBayes.getClassifications(sentence);
  var result = classifierBayes.classify(sentence);

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

    var distance = parseFloat(postivie) - parseFloat(negative);
    if(result == 'negative')
      distance =parseFloat(negative) - parseFloat(postivie);


    //if(parseFloat(neutra) > distance){
    //  score = parseFloat(neutra) ;
    //  result = 'neutra';
    //  console.log('Regra da Distancia');
    //}
  }

  return {result: result, score: parseFloat(score)};
};


var countNeg = 0;
var countPos = 0;
var countNtr = 0;
console.log("TESTE NEGATIVAS");
for(var x = 0; x < negatives.test.length; x++){
  var negResponse = getSentimentNgram(negatives.test[x]);
  //console.log(getSentiment(negatives.test[x]));

  if (negResponse.result == 'positive')
      countPos++;

  else if (negResponse.result == 'negative')
    countNeg++;

  else
    countNtr++;
}
console.log("RESULTADO :");
console.log("POS: ", countPos);
console.log("NEG: ", countNeg);
console.log("NTR: ", countNtr);


console.log("TESTE POSITIVAS");
countNeg = 0;
countPos = 0;
countNtr = 0;
for(var p = 0; p < positives.test.length; p++){
  var posResponse = getSentimentNgram(positives.test[p]);
  //console.log(getSentiment(positives.test[p]));

  if (posResponse.result == 'positive')
    countPos++;

  else if (posResponse.result == 'negative')
    countNeg++;

  else
    countNtr++;
}
console.log("RESULTADO :");
console.log("POS: ", countPos);
console.log("NEG: ", countNeg);
console.log("NTR: ", countNtr);


console.log("TESTE NEUTRAS");
countNeg = 0;
countPos = 0;
countNtr = 0;
console.log(neutras.test.length);
for(var n = 0; n < neutras.test.length; n++){
  var ntrResponse = getSentimentNgram(neutras.test[n]);
 // console.log(getSentiment(neutras.test[n]));

  if (ntrResponse.result == 'positive')
    countPos++;

  else if (ntrResponse.result == 'negative')
    countNeg++;

  else
    countNtr++;
}
console.log("RESULTADO :");
console.log("POS: ", countPos);
console.log("NEG: ", countNeg);
console.log("NTR: ", countNtr);