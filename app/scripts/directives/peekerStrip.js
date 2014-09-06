angular.module('angularPeeker')
    .directive('peekerStrip', [
        '$timeout',
        function ($timeout) {
            return {
                restrict: 'E',
                templateUrl: 'peeker-strip.html',
                controller: function ($scope, $element, $attrs) {
                    $scope.removeStrip = function () {
                        angular.element($element[0].querySelector('.peeker_strip')).addClass('underBottom').removeClass('bottom');
                        $timeout(function () {
                            angular.element.remove();
                        }, 1200);
                    };

                    $scope.$on('angularpeeker:peeker:peekerdeactivated', function () {
                        $scope.removeStrip();
                    });
                },
                link: function (scope, element) {
                    setTimeout(function () {
                        angular.element(element[0].querySelector('.peeker_strip')).addClass('bottom').removeClass('underBottom');
                    }, 200);
                }
            };
        }]);
