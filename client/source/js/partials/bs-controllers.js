/**
 * Created by rodrigo on 17/11/15.
 */


angular.module('application.controllers', ['chart.js', 'socket-io'])

  .controller('DashboardCtrl', function ($scope, socket) {
    $scope.name='Rodrigo';

    $scope.labels = ["Positivo", "Neutra", "Negativo"];
    $scope.data = [1, 1, 1];


    $scope.score = {
      posSentence: 'Frase Positiva de Maior Relevância!',
      negSentence: 'Frase Negativa de Maior Relevância!'
    };


    $scope.getEmotion = function () {
      if ($scope.data[0] > $scope.data[1] && $scope.data[0] > $scope.data[2])
        return 'images/happy.png';
      else if ($scope.data[1] > $scope.data[0] && $scope.data[1] > $scope.data[2])
        return 'images/angry.png';
      else
        return 'images/normal.png';
    };

    socket.on('stream', function (score) {
      console.log(score);
      $scope.data = [score.pos, score.ntr, score.neg];
      $scope.score.posSentence = score.posSentence;
      $scope.score.negSentence = score.negSentence;

    });

  });