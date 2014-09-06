'use strict';

/**
 * @ngdoc service
 * @name angularPeeker.scopeWatcher
 * @description
 * # scopeWatcher
 * Provider in the angularPeeker.
 */
angular.module('angularPeeker')
    .provider('scopeWatcher', function () {

        // Method for instantiating
        this.$get = [
            '$compile',
            function ($compile) {

            }
        ];
    });
