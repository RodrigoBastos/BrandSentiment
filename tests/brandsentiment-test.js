var _ = require('lodash');
var fs = require('fs');
var tokens = require('../server/ngram/tokenSentences');
var natural = require('natural');
var keywordExtractor = require('keyword-extractor');

// Cria classificador Naive Bayes
var classifierBayes = new natural.BayesClassifier();

var extractorOptions = {
  language: 'portuguese',
  remove_digits: true,
  return_changed_case: true,
  remove_duplicates: false
};

/**
 * Remove Links e Usernames do texto de entrada
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

/**
 * Limpa texto de entrada
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
 * Prepara dados de treino e teste
 * @param sentences
 * @returns {{test: Array, train: Array}}
 */
function preClassify(sentences) {
  var test = [];
  var train = [];

  console.log('SENTENCES', sentences.length);
  for (var i = 0; i < sentences.length; i += 1) {
    if (i < 70) test.push(sentences[i]);
    else train.push(sentences[i]);
  }
  return { test: test, train: train };
}

/**
 * Gera documento para classificação
 * @param sentences
 * @param label
 */
function generateDocument(sentences, label) {
  var total = 0;

  for (var i = 0; i < sentences.length; i += 1) {
    // Remove Stopwords
    var sentence = cleanSentence(sentences[i].toLowerCase());
    sentence = removeLinksAndUsername(sentence);
    sentence = keywordExtractor.extract(sentence, extractorOptions);

    var ngrams = [sentence.join()];
    if (sentence.length > 2) ngrams = tokens.textToTrigram(sentence.join(' '));
    else if (sentence.length === 2) ngrams = tokens.textToBigram(sentence.join(' '));

    ngrams.forEach(function (item) { // eslint-disable-line no-loop-func
      if (item.length > 1 && typeof item === 'object' && total < 200) {
        classifierBayes.addDocument(item, label);
        total += 1;
      }
    });
  }
  console.log('TOTAL DOCUMENT: ', total, label);
}

var sentencesNegatives = fs.readFileSync('sentences/negatives-sentences.txt', 'utf8').split('\n');
var sentencesPositives = fs.readFileSync('sentences/positives-sentences.txt', 'utf8').split('\n');
var sentencesNeutras = fs.readFileSync('sentences/neutros-sentences.txt', 'utf8').split('\n');

var negatives = preClassify(sentencesNegatives);
var positives = preClassify(sentencesPositives);
var neutras = preClassify(sentencesNeutras);

// Gera os documentos de treino
generateDocument(negatives.train, 'negative');
generateDocument(positives.train, 'positive');
generateDocument(neutras.train, 'neutra');

// Treina o classificador
classifierBayes.train();

// Classifica frase via NGRAM
var getSentimentNgram = function (sentence) {
  sentence = cleanSentence(sentence.toLowerCase());
  sentence = removeLinksAndUsername(sentence);

  sentence = keywordExtractor.extract(sentence, extractorOptions);

  var ngrams = [sentence.join(' ')];
  if (sentence.length > 2) ngrams = tokens.textToTrigram(sentence.join(' '));
  else if (sentence.length === 2) ngrams = tokens.textToBigram(sentence.join(' '));

  var classification = { result: '', score: 0 };

  ngrams.forEach(function (item) { // eslint-disable-line no-loop-func
    var obj = classifierBayes.getClassifications(item);
    var result = classifierBayes.classify(item);

    var value = _(obj)
      .filter(function (i) { return i.label === result; })
      .pluck('value')
      .value();

    if (value > classification.score) {
      classification.score = value;
      classification.result = result;
    }
  });

  return classification;
};

// Classifica frase de entrada
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

  if (result !== 'neutra') {
    var negative = _(obj)
      .filter(function (item) { return item.label === 'negative'; })
      .pluck('value')
      .value();

    var postivie = _(obj)
      .filter(function (item) { return item.label === 'positive'; })
      .pluck('value')
      .value();

    var neutra = _(obj)
      .filter(function (item) { return item.label === 'neutra'; })
      .pluck('value')
      .value();

    var distance = parseFloat(postivie) - parseFloat(negative);
    if (result === 'negative') {
      distance = parseFloat(negative) - parseFloat(postivie);
    }

    if (parseFloat(neutra) > distance) {
      score = parseFloat(neutra);
      result = 'neutra';
      console.log('Regra da Distancia');
    }
  }
  return { result: result, score: parseFloat(score) };
};

// Testa o classificador
var countNeg = 0;
var countPos = 0;
var countNtr = 0;

console.log('TESTE NEGATIVAS');
for (var x = 0; x < negatives.test.length; x += 1) {
  var negResponse = getSentimentNgram(negatives.test[x]);
  if (negResponse.result === 'positive') countPos += 1;
  else if (negResponse.result === 'negative') countNeg += 1;
  else countNtr += 1;
}

console.log('RESULTADO :');
console.log('POS: ', countPos);
console.log('NEG: ', countNeg);
console.log('NTR: ', countNtr);


console.log('TESTE POSITIVAS');
countNeg = 0;
countPos = 0;
countNtr = 0;

for (var p = 0; p < positives.test.length; p += 1) {
  var posResponse = getSentimentNgram(positives.test[p]);
  if (posResponse.result === 'positive') countPos += 1;
  else if (posResponse.result === 'negative') countNeg += 1;
  else countNtr += 1;
}

console.log('RESULTADO :');
console.log('POS: ', countPos);
console.log('NEG: ', countNeg);
console.log('NTR: ', countNtr);
