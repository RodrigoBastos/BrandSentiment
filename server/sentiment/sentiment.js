var _                     = require("lodash");
var fs                    = require("fs");
var tokens                = require("./../ngram/tokenSentences");
var natural               = require("natural");
var keywordExtractor      = require("keyword-extractor");


var extractorOptions = {
  language:"portuguese",
  remove_digits: true,
  return_changed_case:true,
  remove_duplicates: false
};

var arrayNeg = [];
var arrayPos = [];

//Create classifierBayes
var classifierBayes = new natural.BayesClassifier();

//Read Files Neagtive and Positive
var negatives = fs.readFileSync("sentences/negatives-sentences.txt", "utf8").split("\n");
var positives = fs.readFileSync("sentences/positives-sentences.txt", "utf8").split("\n");
var neutras = fs.readFileSync("sentences/neutros-sentences.txt", "utf8").split("\n");

var sentence = null;

//Push negatives cases in classifierBayes
for(var i = 0; i < negatives.length; i++){

  //Stopwords
  sentence = cleanSentence(negatives[i].toLowerCase());
  sentence = removeLinksAndUsername(sentence);
  sentence = keywordExtractor.extract(sentence, extractorOptions);

  //Ngram (Trigram or Bigram?)
  var trigramsNegative = [sentence.join(" ")];
  if(sentence.length > 2)
    trigramsNegative = tokens.textToTrigram(sentence.join(" "));
  else if (sentence.length == 2)
    trigramsNegative = tokens.textToBigram(sentence.join(" "));

  trigramsNegative.map(function(trigram){
    arrayNeg.push(trigram);
    if(trigram.length > 1 && trigram instanceof Array)
      classifierBayes.addDocument(trigram, "negative");
  });
}
console.log("Frases Negativas carregadas!");

//Push positves cases in Classifier
for(i = 0; i < positives.length; i++){

  sentence = cleanSentence(positives[i].toLowerCase());

  sentence = removeLinksAndUsername(sentence);

  sentence = keywordExtractor.extract(sentence, extractorOptions);

  var trigramsPositive = [sentence.join(" ")];
  if(sentence.length > 2)
    trigramsPositive = tokens.textToTrigram(sentence.join(" "));
  else if (sentence.length == 2)
    trigramsPositive = tokens.textToBigram(sentence.join(" "));

  trigramsPositive.map(function(trigram){
    arrayPos.push(trigram);
    if(trigram.length > 1 && trigram instanceof Array)
      classifierBayes.addDocument(trigram, "positive");
  });

}

console.log("Frases Positivas carregadas!");

//Push positves cases in Classifier
for(i = 0; i < neutras.length; i++){

  sentence = cleanSentence(neutras[i].toLowerCase());

  sentence = removeLinksAndUsername(sentence);

  sentence = keywordExtractor.extract(sentence, extractorOptions);

  var trigramsNeutra = [sentence.join(" ")];
  if(sentence.length > 2)
    trigramsNeutra = tokens.textToTrigram(sentence.join(" "));
  else if (sentence.length == 2)
    trigramsNeutra = tokens.textToBigram(sentence.join(" "));


  trigramsNeutra.map(function(trigram){
    arrayPos.push(trigram);
    if(trigram.length > 1 && trigram instanceof Array )
      classifierBayes.addDocument(trigram, "neutra");


  });

}
console.log("Frases Neutras carregadas!");

//Train
classifierBayes.train();

console.log("Classificador Treinado!");

var classifySentiment = function (sentence) {
  return classifierBayes.classify(sentence);
};

var objectSentiment = function (sentence) {
  console.log("objectSentiment - Text", sentence);
  sentence = keywordExtractor.extract(sentence, extractorOptions);

  var trigrams = [sentence];
  if(sentence.length > 2)
    trigrams = tokens.textToTrigram(sentence.join(" "));

  console.log("objectSentiment - keywords", trigrams);
  var scorePos = 0;
  var scoreNeg = 0;
  var scoreNtr = 0;


  trigrams.map(function(trigram, index){
    console.log("trigram "+index+": ", trigram);

    var obj = classifierBayes.getClassifications(trigram);

    obj.map(function(item){
      if(item.label == "positive")
        scorePos += item.value;

      if(item.label == "negative")
        scoreNeg += item.value;

      if(item.label == "neutra")
        scoreNtr += item.value;
    });
  });

  if(scorePos > scoreNeg && scorePos > scoreNtr)
    return "positive";

  else if(scoreNeg > scorePos && scoreNeg > scoreNtr)
    return "negative";

  else
    return "neutra";
};

var scoreSentiment = function (sentence) {

  console.log("sentence :", sentence);
  sentence = keywordExtractor.extract(sentence, extractorOptions);
  var score = [];
  console.log("keyword :", sentence);

  var trigrams = [sentence];
  if(sentence.length > 2)
    trigrams = tokens.textToTrigram(sentence.join(" "));

  console.log("trigrams :", trigrams);


  trigrams.map(function(trigram, index){
    var obj = classifierBayes.getClassifications(trigram);
    score.push({trigram: JSON.stringify(trigram), classify: JSON.stringify(obj)});
  });

  return score;
};

var getSentiment = function (sentence) {

  sentence = cleanSentence(sentence.toLowerCase());
  sentence = removeLinksAndUsername(sentence);

  sentence = keywordExtractor.extract(sentence, extractorOptions).join(" ");

  var obj = classifierBayes.getClassifications(sentence);
  var result = classifierBayes.classify(sentence);

  var score = _(obj)
    .filter(function(item) { return item.label == result; })
    .pluck("value")
    .value();

  if(result != "neutra"){
    var negative = _(obj)
      .filter(function(item) { return item.label == "negative"; })
      .pluck("value")
      .value();

    var postivie = _(obj)
      .filter(function(item) { return item.label == "positive"; })
      .pluck("value")
      .value();

    var neutra = _(obj)
      .filter(function(item) { return item.label == "neutra"; })
      .pluck("value")
      .value();

    var distance = parseFloat(postivie) - parseFloat(negative);
    if(result == "negative")
        distance =parseFloat(negative) - parseFloat(postivie);


    //if(parseFloat(neutra) > distance){
    //  score = parseFloat(neutra) ;
    //  result = "neutra";
    //  console.log("Regra da Distancia");
    //}
  }

  return {result: result, score: parseFloat(score)};
};


//console.log(getSVM(["Estou triste com você!"]));

function removeLinksAndUsername (sentence) {
  var words = sentence.split(" ");
  var result = words.map(function(word){
    //console.log("include: ", _.include(word, "https://"));
    if(!_.include(word, "https://") && !_.include(word, "@"))
      return word;
  });

  return result.join(" ");
}

function cleanSentence (sentence){

  return sentence.replace(/(\?)+/, "?")
    .replace(/(\.)+/, ".")
    .replace(/(\!)+/, "!")
    .replace(/(\))+/, ")")
    .replace(/(\()+/, "(")
    ;

}

module.exports = {
  classify: classifySentiment,
  object: objectSentiment,
  score: scoreSentiment,
  sentimet: getSentiment
};
