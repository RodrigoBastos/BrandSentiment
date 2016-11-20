var natural = require("natural");

// Cria tokenizador
var tokenizer = new natural.WordTokenizer();
tokenizer._pattern =  /\s+/;

// Cria objeto Ngram
var NGrams = natural.NGrams;
NGrams.setTokenizer(tokenizer);

// Transforma texto em Trigram
exports.textToTrigram = function(text){
  return NGrams.trigrams(text);
};

// Transforma texto para Bigram
exports.textToBigram = function(text){
  return NGrams.bigrams(text);
};


