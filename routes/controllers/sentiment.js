/**
 * Created by rodrigo on 09/07/15.
 */

var natural   = require('natural');

var  classifier = new natural.BayesClassifier();


classifier.addDocument('Eu estou triste', 'negative');
classifier.addDocument('Eu vou morrer', 'negative');
classifier.addDocument('Eu não gosto disso', 'negative');
classifier.addDocument('Eu odeio biscoito', 'negative');
classifier.addDocument('Eu estou feliz', 'positive');
classifier.addDocument('Eu vou comer', 'positive');
classifier.addDocument('Eu gosto de sorvete', 'positive');
classifier.addDocument('Eu amo feijoada', 'positive');


classifier.train();

console.log(classifier.classify('Ele gosta disso'));