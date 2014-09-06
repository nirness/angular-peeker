angular.module('angularPeekerTest')
    .controller('MainCtrl', [
        '$scope',
        function ($scope) {
            console.log('MainCtrl: $scope: ', $scope);
        }
    ]);
