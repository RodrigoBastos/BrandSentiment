var path = require('path');
var express = require('express');
var mainRoutes = require('./server/routes/mainRoutes.js');

// Aplicação
function App() {
  return express()
    // Configura express
    .set('port', 4100)
    .set('view engine', 'jade')
    .set('views', path.join(__dirname, 'client', 'views'))

    // Middlewares
    .use(express.static(path.join(__dirname, 'client', 'public')))
    .use(mainRoutes);
}
// Exporta aplicação
module.exports = App;
