angular.module('application.controllers', ['chart.js', 'socket-io'])
  .controller('DashboardCtrl', function ($scope, socket) {
    $scope.name = 'Rodrigo';

    $scope.labels = ['Positivo', 'Neutra', 'Negativo'];
    $scope.data = [1, 1, 1];
    $scope.score = {
      posSentence: 'Frase Positiva de Maior Relevância!',
      negSentence: 'Frase Negativa de Maior Relevância!',
      total: 0
    };


    $scope.getEmotion = function () {
      if ($scope.data[0] > $scope.data[1] && $scope.data[0] > $scope.data[2]) return 'images/happy.png';
      else if ($scope.data[2] > $scope.data[0] && $scope.data[2] > $scope.data[1]) return 'images/angry.png';
      return 'images/normal.png';
    };

    socket.on('stream', function (score) {
      console.log(score);
      $scope.score.total = score.pos + score.ntr + score.neg;
      $scope.data = [score.pos, score.ntr, score.neg];
      $scope.score.posSentence = score.posSentence !== '' ? score.posSentence: $scope.score.posSentence;
      $scope.score.negSentence = score.negSentence !== '' ? score.negSentence: $scope.score.negSentence;
    });
  });
