var _ = require('lodash');
var fs = require('fs');
var tokens = require('./../ngram/tokenSentences');
var natural = require('natural');
var keywordExtractor = require('keyword-extractor');

// Define opções para extração de palavras-chaves
var extractorOptions = {
  language: 'portuguese',
  remove_digits: true,
  return_changed_case: true,
  remove_duplicates: false
};

// Cria classificador Naive Bayes
var classifierBayes = new natural.BayesClassifier();

// Lê frases positivas e negativas da base de conhecimento
var negatives = fs.readFileSync('sentences/negatives-sentences.txt', 'utf8').split('\n');
var positives = fs.readFileSync('sentences/positives-sentences.txt', 'utf8').split('\n');
var neutras = fs.readFileSync('sentences/neutros-sentences.txt', 'utf8').split('\n');

/**
 * Remove caracteres repetidos
 * @param sentence
 * @returns {string|XML}
 */
function cleanSentence(sentence) {
  return sentence.replace(/(\?)+/, '?')
    .replace(/(\.)+/, '.')
    .replace(/(!)+/, '!')
    .replace(/(\))+/, ')')
    .replace(/(\()+/, '(');
}

/**
 * Remove hyperlinks e username
 * @param sentence
 * @returns {string}
 */
function removeLinksAndUsername(sentence) {
  var words = sentence.split(' ');
  return words.map(function (word) {
    if (!_.include(word, 'https://') && !_.include(word, '@')) return word;
    return false;
  }).filter(Boolean).join(' ');
}

function addPhraseInClassifier(phrase, category) {
  phrase = cleanSentence(phrase.toLowerCase());
  phrase = removeLinksAndUsername(phrase);
  phrase = keywordExtractor.extract(phrase, extractorOptions);

  var trigrams = [phrase.join(' ')];
  if (phrase.length > 2) trigrams = tokens.textToTrigram(phrase.join(' '));
  else if (phrase.length === 2) trigrams = tokens.textToBigram(phrase.join(' '));

  trigrams.forEach(function (trigram) {
    if (trigram.length > 1 && typeof trigram === 'object') classifierBayes.addDocument(trigram, category);
  });
}

// Adiciona frases negativas no classificador
negatives.forEach(addPhraseInClassifier, 'negative');
console.log('Frases Negativas carregadas!');

// Adiciona frases positivas no classificador
positives.forEach(addPhraseInClassifier, 'positive');

console.log('Frases Positivas carregadas!');

// Adiciona frases neutras no classificador
neutras.forEach(addPhraseInClassifier, 'neutra');
console.log('Frases Neutras carregadas!');

// Treina classificador
classifierBayes.train();

console.log('Classificador Treinado!');

var classifySentiment = function (sentence) {
  return classifierBayes.classify(sentence);
};

var objectSentiment = function (sentence) {
  console.log('objectSentiment - Text', sentence);
  var scorePos = 0;
  var scoreNeg = 0;
  var scoreNtr = 0;

  sentence = keywordExtractor.extract(sentence, extractorOptions);
  var trigrams = [sentence];
  if (sentence.length > 2) trigrams = tokens.textToTrigram(sentence.join(' '));

  console.log('objectSentiment - keywords', trigrams);
  trigrams.forEach(function (trigram, index) {
    console.log('trigram ' + index + ': ', trigram);
    var obj = classifierBayes.getClassifications(trigram);
    obj.forEach(function (item) {
      if (item.label === 'positive') scorePos += item.value;
      if (item.label === 'negative') scoreNeg += item.value;
      if (item.label === 'neutra') scoreNtr += item.value;
    });
  });

  if (scorePos > scoreNeg && scorePos > scoreNtr) return 'positive';
  if (scoreNeg > scorePos && scoreNeg > scoreNtr) return 'negative';
  return 'neutra';
};

var scoreSentiment = function (sentence) {
  console.log('phrases :', sentence);
  sentence = keywordExtractor.extract(sentence, extractorOptions);
  var score = [];
  console.log('keyword :', sentence);

  var trigrams = [sentence];
  if (sentence.length > 2) trigrams = tokens.textToTrigram(sentence.join(' '));

  console.log('trigrams', trigrams);

  trigrams.forEach(function (trigram) {
    var obj = classifierBayes.getClassifications(trigram);
    score.push({ trigram: JSON.stringify(trigram), classify: JSON.stringify(obj) });
  });

  return score;
};

var getSentiment = function (sentence) {
  sentence = cleanSentence(sentence.toLowerCase());
  sentence = removeLinksAndUsername(sentence);

  sentence = keywordExtractor.extract(sentence, extractorOptions).join(' ');

  var obj = classifierBayes.getClassifications(sentence);
  var result = classifierBayes.classify(sentence);

  var score = _(obj)
    .filter(function (item) { return item.label === result; })
    .pluck('value')
    .value();

  // if (result !== 'neutra') {
  //   var negative = _(obj)
  //     .filter(function (item) { return item.label === 'negative'; })
  //     .pluck('value')
  //     .value();
  //
  //   var positive = _(obj)
  //     .filter(function (item) { return item.label === 'positive'; })
  //     .pluck('value')
  //     .value();
  //
  //   var neutra = _(obj)
  //     .filter(function (item) { return item.label === 'neutra'; })
  //     .pluck('value')
  //     .value();
  //
  //   var distance = parseFloat(postivie) - parseFloat(negative);
  //   if (result === 'negative') distance = parseFloat(negative) - parseFloat(postivie);
  // }

  return { result: result, score: parseFloat(score) };
};

module.exports = {
  classify: classifySentiment,
  object: objectSentiment,
  score: scoreSentiment,
  sentiment: getSentiment
};
