var express = require("express");
var path    = require("path");
var twitterClient = require("./server/config/index.js").twitterClient;
var app = express();
var port = 3700;

//app.get("/", function(req, res){
//  res.send("It works!");
//});

app.set("views", path.join(__dirname, "client", "views"));
app.set("view engine", "jade");

app.use(express.static(path.join(__dirname, "client", "public")));

app.get("/", function(req, res){
  res.render("home");
});

var io = require("socket.io").listen(app.listen(port));
console.log("Listening on port " + port);

io.sockets.on("connection", function (socket) {

  socket.on("start stream", function() {
    if (stream === null){
      stream = twitterClient.stream("statuses/filter", {
        track: "Paris"
      });

      stream.on("tweet", function (tweet) {
        socket.broadcast.emit("new tweet", tweet.text);
        socket.emit("new tweet", tweet.text);
      });
    }
  });

  socket.on("disconnect", function (o){
    console.log("Desonnected!", o);
  });

  //socket.emit("message", { message: "welcome to the chat" });
  //socket.on("send", function (data) {
  //  io.sockets.emit("message", data);
  //});
});