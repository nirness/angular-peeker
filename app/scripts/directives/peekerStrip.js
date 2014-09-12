angular.module('angularPeeker')
    .directive('peekerStrip', [
        '$rootScope',
        '$timeout',
        function ($rootScope, $timeout) {
            return {
                restrict: 'E',
                templateUrl: 'peeker-strip.html',
                controller: function ($scope, $element, $attrs) {
                    // Init
                    $scope.scopeViewerState = 'Hide';
                    $scope.scopeViewerActive = false;

                    $scope.toggleShowHideText = function () {
                        $scope.scopeViewerState = $scope.scopeViewerState === 'Hide' ? 'Show' : 'Hide';
                    };

                    $scope.toggleShowHideState = function () {
                        $rootScope.$broadcast('angularpeeker:peekerstrip:requesttogglestate', $scope.scopeViewerState);
                        $scope.toggleShowHideText();
                    };

                    $scope.removeStrip = function () {
                        angular.element($element[0].querySelector('.peeker_strip')).addClass('underBottom').removeClass('bottom');
                        $timeout(function () {
                            $element.remove();
                        }, 1200);
                    };


                    //Setup scope listeners
                    $scope.$on('angularpeeker:peeker:scopevieweractive', function () {
                        $scope.scopeViewerActive = true;
                    });

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
