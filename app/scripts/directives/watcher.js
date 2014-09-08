angular.module('angularPeeker')
    .directive('watcher', [
        'ScopeShow',
        function (ScopeShow) {
            var doc;


            return {
                restrict: 'E',
                templateUrl: 'watcher.html',
                controller: function ($scope, $element, $attrs) {
                    $scope.toggleShow = function () {
                        if ($element[0].style.opacity === '1') {
                            $element[0].style.opacity = '0.1';
                        } else {
                            $element[0].style.opacity = '1';
                        }
                    };
                },
                link: function (scope, element) {
                    var link = ScopeShow.createDisplayModel(
                        scope.selectedScope,
                        null,
                        'selectedScope');
                    doc = link(scope);
                    element[0].querySelector('.angular_peeker_container').appendChild(doc[0]);
                }
            };
        }]);
