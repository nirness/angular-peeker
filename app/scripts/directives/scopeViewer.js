angular.module('angularPeeker')
    .directive('scopeViewer', [
        'scopeViewBuilder',
        function (scopeViewBuilder) {
            var doc;


            return {
                restrict: 'E',
                templateUrl: 'scopeViewer.html',
                controller: function ($scope, $element, $attrs) {

                },
                link: function (scope, element) {
                    var link = scopeViewBuilder.createDisplayModel(
                        scope.selectedScope,
                        null,
                        'selectedScope');
                    doc = link(scope);
                    element[0].querySelector('.angular_peeker_container').appendChild(doc[0]);
                }
            };
        }]);
