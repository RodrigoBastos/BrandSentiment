var fs = require('fs');
var _ = require('lodash');

// Remove links das frases
function removeLinks(words) {
  return words.map(function (word) {
    if (!_.include(word, 'http')) return word.trim();
    return false;
  }).filter(Boolean);
}

// Lendo frases negativas
var negatives = fs.readFileSync('sentences.txt', 'utf8').split('\n');

// Percorre o array de frases negativas
negatives.forEach(function (sentence) {
  console.log('Sentence: ', sentence);
  var words = sentence.split(' ');
  console.log('Array: ', words);
  words = removeLinks(words);
  console.log('Sem Links: ', words);
});
