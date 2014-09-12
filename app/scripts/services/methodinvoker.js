(function () {
    'use strict';

    /**
     * @ngdoc service
     * @name angularPeeker.methodInvoker
     * @description
     * # methodInvoker
     * Factory in the angularPeeker.
     */
    angular.module('angularPeeker')
        .factory('methodInvoker', function () {
            var factory = {
                invoke: function (scope, methodName) {
                    scope[methodName]();
                }
            };

            return factory;
        });
}());