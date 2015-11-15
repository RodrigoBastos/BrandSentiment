/**
 * Created by rodrigo on 05/07/15.
 */

var express = require('express');
var mainCtrl = require('./controllers/mainCtrl');


module.exports = new express.Router()

  .get('/', mainCtrl.getIndex)
;