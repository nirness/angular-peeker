(function () {
    'use strict';

    /**
     * @ngdoc directive
     * @name angularPeeker.directive:methodViewer
     * @description
     * # methodViewer
     */
    angular.module('angularPeeker')
        .directive('methodViewer', [
            'domActions',
            function (domActions) {
                return {
                    templateUrl: 'method-viewer.html',
                    restrict: 'E',
                    scope: {
                        methodName: '=',
                        selectedScope: '='
                    },
                    link: function postLink (scope, element, attrs) {
                        var div = domActions.find('.method_content', element)[0];
                        div.innerHTML = '<pre>' + (scope.selectedScope[scope.methodName] || null).toString() + '</pre>';

                        scope.remove = function () {
                            element.remove();
                        };
                    }
                };
            }]);
}());