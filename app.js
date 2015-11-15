/**
 * Created by Rodrigo Bastos on 28/10/15.
 */

var path        = require('path');
var express     = require('express');
var mainRoutes  = require('./server/routes/mainRoutes.js');


function App () {

  return express()

    // Express configuration
    .set('port', 4100)
    .set('view engine', 'jade')
    .set('views', path.join(__dirname, 'client', 'views'))

    //Middlewares
    .use(express.static(path.join(__dirname, 'client', 'public')))
    .use(mainRoutes)
  ;
}


module.exports = App;