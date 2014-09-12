(function () {
    'use strict';

    /**
     * @ngdoc service
     * @name angularPeeker.logger
     * @description
     * # logger
     * Factory in the angularPeeker.
     */
    angular.module('angularPeeker')
        .factory('logger', function () {
            var config = {
                    basicInfo: {
                        background: '#FFFF66',
                        color: '000'
                    }
                },

                buildColorString = function (name) {
                    return 'background: ' + config[name].background + ';color: ' + config[name].color;
                },

                convertArgumentsToArray = function (args, sliceFrom) {
                    return Array.prototype.slice.call(args, sliceFrom);
                },

                logWColor = function (str, color) {
                    console.log(str, color);
                },

                cLogArr = function (args) {
                    args.forEach(function (arg) {
                        console.log(arg);
                    });
                },

                api = {
                    basicInfo: function () {
                        var firstArg = '%c' + arguments[0];
                        logWColor(firstArg, buildColorString('basicInfo'));
                        var args = convertArgumentsToArray(arguments, 1);
                        cLogArr(args);
                    }
                };

            // Public API here
            return {
                l: api.basicInfo
            };
        });
}());