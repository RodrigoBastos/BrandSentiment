/**
 * Created by rodrigo on 15/11/15.
 */

var path                  = require('path');
var express               = require('express');
var bodyParser            = require('body-parser');
var cookieParser          = require('cookie-parser');
var expressSession        = require('express-session');

var twitterClient         = require('./server/config/index.js').twitterClient;
var analysisSentiment     = require('./server/sentiment/sentiment.js');

var cookie = cookieParser(process.env.SESSION_SECRET);
var store  = new expressSession.MemoryStore();

var app = express();


app.set('views', path.join(__dirname, 'client', 'views'));
app.set('view engine', 'jade');

app.use(bodyParser.json());
app.use(expressSession({
  secret: process.env.SESSION_SECRET,
  name: process.env.SESSION_KEY,
  resave: true,
  saveUninitialized: true,
  store: store
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'client', 'public')));


var stream = null;

app.get('/', function (req, res) {
  res.render('index', {title: 'BRAND SENTIMENT'});
});

app.post('/search', function (req, res) {

  console.log(req.session);
  var query = req.body.query;
  io.sockets.on('connection', function (socket) {

    var session = socket.handshake.session;
    if(session.stream != null)
      session.stream.stop();

    session.pos = 0;
    session.neg = 0;
    console.log('session', session);
    console.log('Connected');
    var countNegative = 0;
    var countPositive = 0;
    session.stream = twitterClient.stream('statuses/filter', {
      track: query
    });

    session.stream.on('tweet', function (tweet) {

      console.log('tweet', tweet.text);
      var result = analysisSentiment.classify(tweet.text);
      if (result == 'positive')
        session.pos++;
      else
        session.neg++;
      io.sockets.emit('stream', {pos:session.pos, neg:session.neg});

    });
  });

  res.render('twitter', {title: query});
});


var io = require("socket.io").listen(app.listen(3800));


io.use(function(socket, next) {
  var data = socket.request;
  cookie(data, {}, function(err) {
    var sessionID = data.signedCookies[process.env.SESSION_KEY];
    store.get(sessionID, function(err, session) {
      if (err || !session) {
        return next(new Error('Acesso negado!'));
      } else {
        socket.handshake.session = session;
        return next();
      }
    });
  });
});
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
