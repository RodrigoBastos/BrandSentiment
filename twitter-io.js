/**
 * Created by rodrigo on 15/11/15.
 */

var express     = require('express');
var bodyParser  = require('body-parser');
var twitterClient     = require('./server/config/index.js').twitterClient;
var analysisSentiment = require('./server/sentiment/sentiment.js');
var path        = require('path');
var app = express();

app.set('views', path.join(__dirname, 'client', 'views'));
app.set('view engine', 'jade');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'client', 'public')));

app.get('/', function (req, res) {

  res.render('index', {title: 'BRAND SENTIMENT'});
});

app.post('/search', function (req, res) {

  var query = req.body.query;
  io.sockets.on('connection', function (socket) {
    console.log('Connected');
    var countNegative = 0;
    var countPositive = 0;
    var stream = twitterClient.stream('statuses/filter', {
      track: query
    });

    stream.on('tweet', function (tweet) {

      console.log('tweet', tweet.text);
      var result = analysisSentiment.classify(tweet.text);
      if (result == 'positive')
        countPositive++;
      else
        countNegative++;
      io.sockets.emit('stream', {pos:countPositive, neg:countNegative});

    });
  });

  res.render('twitter', {title: query});
});


var io = require("socket.io").listen(app.listen(3800));



//io.sockets.on('connection', function (socket) {
//  var stream = twitterClient.stream('statuses/filter', {
//    'track':'playstation',
//    'filter_level':'medium',
//    'language': 'es,en'
//  });
//
//  stream.on('tweet', function(tweet) {
//    console.log('tweet', tweet.text);
//    socket.emit('twitter', tweet.text);
//  });
//});
