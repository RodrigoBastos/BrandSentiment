/**
 * Created by rodrigo on 05/07/15.
 */

var path      = require('path');
var express   = require('express');

var app = express();
var routes = require('./routes/config/main');

app.set('port', 3000);
app.set('view engine', 'jade');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(routes);

app.listen( app.get('port'), onListen);

function onListen () {
  console.log('In desenv, app.js');

  console.log(
    'Express listening on ' +
    'port ' + app.get('port'));
}
