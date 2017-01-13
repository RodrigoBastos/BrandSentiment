var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var twitterClient = require('./server/config/index.js').twitterClient;
var analysisSentiment = require('./server/sentiment/sentiment.js');

var cookie = cookieParser(process.env.SESSION_SECRET);
var store = new expressSession.MemoryStore();

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

// Serviço principal da aplicação
app.get('/', function (req, res) {
  if (stream != null) stream.stop();

  // Retorna página inicial da aplicação
  res.render('index', { title: 'BRAND SENTIMENT' });
});

// Abre conexão do servidor na porta 3800
var io = require('socket.io').listen(app.listen(3800));

// Vincula a sessão com o canal de comunicação do socket
io.use(function (socket, next) {
  var data = socket.request;
  cookie(data, {}, function () {
    // Pega ID da sessão
    var sessionID = data.signedCookies[process.env.SESSION_KEY];

    store.get(sessionID, function (err, session) {
      if (err || !session) return next(new Error('Acesso negado!'));
      socket.handshake.session = session;
      return next();
    });
  });
});

// Serviço responsável pela análise de sentimento  e geração do Dashboard
app.post('/search', function (req, res) {
  console.log(req.body);

  if (stream) stream.stop();

  // Consulta requisita pelo usuário
  var query = req.body.query;

  // Inicializa Socket
  io.sockets.on('connection', function (socket) {
    console.log('Socket Conectado!');
    var session = socket.handshake.session;

    // Informações para o dashboard
    session.pos = 0;
    session.neg = 0;
    session.ntr = 0;
    session.posSentence = '';
    session.posScore = 0;
    session.negSentence = '';
    session.negScore = 0;

    // Cria stream de conexão com o Twitter
    stream = twitterClient.stream('statuses/filter', {
      track: query,
      lang: 'pt',
      retweeted: false
    });

    stream.on('tweet', function (tweet) {
      // Verifica se os tweets são da língua portuguesa
      if (tweet.lang === 'pt') {
        console.log('tweet', tweet.text);

        // Classifica
        var obj = analysisSentiment.sentimet(tweet.text);

        // Dados referente a classe positiva
        console.log('RESULTADO: ', obj);

        if (obj.result === 'positive') {
          if (parseFloat(obj.score) > session.posScore) {
            session.posScore = parseFloat(obj.score);
            session.posSentence = tweet.text;
          }
          session.pos += 1;
        } else if (obj.result === 'negative') {
          if (parseFloat(obj.score) > session.negScore) {
            session.negScore = parseFloat(obj.score);
            session.negSentence = tweet.text;
          }
          session.neg += 1;
        } else session.ntr += 1;

        // Atualiza dados
        io.sockets.emit('stream',
          {
            posScore: session.posScore,
            posSentence: session.posSentence,
            negScore: session.negScore,
            negSentence: session.negSentence,
            pos: session.pos,
            neg: session.neg,
            ntr: session.ntr
          });
      }
    });
  });

  // Retorna página com o resultado da consulta
  res.render('twitter', { title: query });
});
