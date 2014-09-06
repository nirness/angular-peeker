angular.module('angularPeeker')
    .directive('watcher', function () {

        var getItemsToShow = function (scope) {
            var functions = [],
                models = [],
                primitives = [],
                arrays = [],
                key;
            for (key in scope) {
                if (scope.hasOwnProperty(key)) {

                    if (angular.isString(scope[key]) ||
                        angular.isNumber(scope[key]) ||
                        scope[key] === false ||
                        scope[key] === true) {
                        if (key.indexOf('$$') !== 0) {
                            primitives.push({
                                name: key,
                                value: scope[key]
                            });
                        }
                    } else if (angular.isFunction(scope[key])) {
                        if (key.indexOf('$$') !== 0) {
                            functions.push({
                                name: key,
                                value: scope[key]
                            });
                        }
                    } else if (angular.isArray(scope[key])) {
                        if (key.indexOf('$$') !== 0) {
                            arrays.push({
                                name: key,
                                value: scope[key]
                            });
                        }
                    } else {
                        if (key.indexOf('$$') !== 0) {
                            models.push({
                                name: key,
                                value: scope[key]
                            });
                        }
                    }
                }
            }

            return {
                functions: functions,
                models: models,
                primitives: primitives,
                arrays: arrays
            };

        };

        return {
            restrict: 'E',
            templateUrl: 'watcher.html',
            controller: function ($scope, $element, $attrs) {
                // breakdown items to show
                $scope.itemsToShow = getItemsToShow($scope.selectedScope);

            },
            link: function (scope, element) {
            }
        };
    });
