// include partials/bs-twitter-count.js
//= include ../components/angular/angular.js
//= include ../components/Chart.js/Chart.js
//= include ../components/angular-chart.js/dist/angular-chart.js
//= include ../components/ng-socket-io/ng-socket-io.js
//= include partials/bs-controllers.js

(function () {
  angular.module("application", [
    "chart.js",
    "application.controllers"
  ])
})();