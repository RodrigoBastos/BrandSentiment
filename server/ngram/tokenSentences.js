var natural = require("natural");

//Create Tokenize
var tokenizer = new natural.WordTokenizer();
tokenizer._pattern =  /\s+/;

//Create Ngram Object
var NGrams = natural.NGrams;
NGrams.setTokenizer(tokenizer);

//Change Text to Array Trigram
exports.textToTrigram = function(text){
  return NGrams.trigrams(text);
};

//Change Text to Array Trigram
exports.textToBigram = function(text){
  return NGrams.bigrams(text);
};


