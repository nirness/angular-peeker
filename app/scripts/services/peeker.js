'use strict';

/**
 * @ngdoc service
 * @name angularPeeker.peeker
 * @description
 * # peeker
 * Provider in the angularPeeker.
 */
angular.module('angularPeeker')
    .provider('peeker', [
        'configProvider',
        function (config) {
            debugger;
            //===========================
            //      Private Methods     =
            //===========================
            var getScope = function (elem) {
                return angular.element(elem).scope();
            };


            // Private constructor
            function Peeker () {
                this.displayScope = function (evt) {
                    console.log(evt.srcElement);
                    console.log(getScope(evt.srcElement));
                };
            }

            // Public API for configuration
            this.setActivationKey = function (key) {
                config.peekerHotKey = key;
            };
            this.setActivationKeyAlt = function (alt) {
                config.peekerHotKey.altKey = alt;
            };
            this.setActivationKeyCtrl = function (ctrl) {
                config.peekerHotKey.ctrlKey = ctrl;
            };
            this.setActivationKeyShift = function (shift) {
                config.peekerHotKey.shiftKey = shift;
            };
            this.setActivationConfiguration = function (configObj) {
                for (var key in configObj) {
                    if (configObj.hasOwnProperty(key)) {
                        config.peekerHotKey[key] = configObj[key];
                    }
                }
            };

            // Method for instantiating
            this.$get = function () {
                return new Peeker();
            };
        }]);
