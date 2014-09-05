'use strict';

/**
 * @ngdoc function
 * @name angularPeekerApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the angularPeekerApp
 */
angular.module('angularPeekerApp')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
