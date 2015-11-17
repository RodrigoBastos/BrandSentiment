/**
 * Created by rodrigo on 17/11/15.
 */


angular.module('application.controllers', ['chart.js', 'socket-io'])

  .controller('DashboardCtrl', function ($scope, socket) {
    $scope.name='Rodrigo';

    $scope.labels = ["Positivo", "Negativo"];
    $scope.data = [0, 0];

    socket.on('stream', function (score) {
      console.log(score);
      $scope.data = [score.pos, score.neg]
    });

  });