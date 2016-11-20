var express = require("express");
var mainCtrl = require("./controllers/mainCtrl");

// Rotas
module.exports = new express.Router()
  .get("/", mainCtrl.getIndex)
  .get("/watch", mainCtrl.getWatchTwitter);