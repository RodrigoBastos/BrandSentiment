var socket = io.connect('http://localhost:3800');
socket.on('stream', function (score) {
  console.log(score);
  $('#tweetpos').text('Tweets Positivos', score.pos);
  $('#tweetneg').text('Tweets Negativos', score.neg);
});
