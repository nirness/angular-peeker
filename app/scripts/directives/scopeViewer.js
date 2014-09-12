angular.module('angularPeeker')
    .directive('scopeViewer', [
        'scopeViewBuilder',
        function (scopeViewBuilder) {
            var viewer;


            return {
                restrict: 'E',
                templateUrl: 'scopeViewer.html',
                controller: function ($scope, $element, $attrs) {

                    // Cleanup
                    $element.on('$destroy', function (evt) {
                        $scope = null;
                    });
                },
                link: function (scope, element) {


                    // scope methods
                    //==============
                    scope.destroyViewer = function () {
                        element.remove();
                        viewer = null;
                    };

                    scope.appendViewer = function () {
                        element[0].querySelector('.angular_peeker_container').appendChild(viewer[0]);
                    };

                    scope.hideElement = function () {
                        element[0].style.display = 'none';
                    };

                    scope.showElement = function () {
                        element[0].attributes.removeNamedItem('style');
                    };


                    // Init
                    //=======

                    // Build the scope view and get a link function
                    var link = scopeViewBuilder.buildScopeView(
                        scope.selectedScope, // The selected scope
                        null, // No original doc
                        'selectedScope' // The name of the original property
                    );
                    // Run the link function
                    viewer = link(scope);
                    // Append the result document to angular_peeker_container
                    scope.appendViewer();


                    // Set scope listeners
                    scope.$on('angularpeeker:peekerstrip:requesttogglestate', function (evt, data) {
                        if (data.toLowerCase() === 'hide') {
                            scope.hideElement();
                        } else {
                            scope.showElement();
                        }
                    });

                    scope.$on('angularpeeker:peekerstrip:requestdestroyviewer', function () {
                        scope.destroyViewer();
                    });
                }
            };
        }]);
