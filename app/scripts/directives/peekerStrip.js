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
                    $scope.selectorActive = true;

                    $scope.toggleShowHideText = function () {
                        $scope.scopeViewerState = $scope.scopeViewerState === 'Hide' ? 'Show' : 'Hide';
                    };

                    $scope.toggleShowHideState = function () {
                        $rootScope.$broadcast('angularpeeker:peekerstrip:requesttogglestate', $scope.scopeViewerState);
                        $scope.toggleShowHideText();
                    };

                    $scope.activateSelector = function ($event) {
                        // Prevent the click event from becoming the selector target
                        $event.preventDefault();
                        $event.stopPropagation();

                        // Set the strips state params
                        $scope.scopeViewerState = 'Hide';
                        $scope.scopeViewerActive = false;

                        // Broadcast requestdestroyviewer To destroy the scope viewer
                        $rootScope.$broadcast('angularpeeker:peekerstrip:requestdestroyviewer', $scope.scopeViewerState);

                        // Broadcast requestselectoractivate To activate the element selector
                        $rootScope.$broadcast('angularpeeker:peekerstrip:requestselectoractivate', $scope.scopeViewerState);
                    };

                    $scope.removeStrip = function () {
                        angular.element($element[0].querySelector('.peeker_strip')).addClass('underBottom').removeClass('bottom');
                        $timeout(function () {
                            $element.remove();
                        }, 1200);
                    };


                    //Setup scope listeners
                    $scope.$on('angularpeeker:peeker:scopevieweractivated', function () {
                        $scope.scopeViewerActive = true;
                    });

                    $scope.$on('angularpeeker:peeker:peekerdeactivated', function () {
                        $scope.removeStrip();
                    });

                    $scope.$on('angularpeeker:peeker:selectoractivated', function () {
                        $scope.selectorActive = true;
                    });

                    $scope.$on('angularpeeker:peeker:selectordeactivated', function () {
                        $scope.selectorActive = false;
                    });
                },
                link: function (scope, element) {
                    setTimeout(function () {
                        angular.element(element[0].querySelector('.peeker_strip')).addClass('bottom').removeClass('underBottom');
                    }, 200);

                }
            };
        }]);
