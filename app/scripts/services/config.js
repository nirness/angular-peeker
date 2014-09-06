/**
 * @ngdoc service
 * @name angularPeeker.config
 * @description
 * # config
 * Value in the angularPeeker.
 */
angular.module('angularPeeker')
    .provider('config', [
        function () {
            var peekerHotKey = {
                key: 'p',
                altKey: true,
                shiftKey: false,
                ctrlKey: true
            };

            // Public API for configuration
            this.setActivationKey = function (key) {
                peekerHotKey.key = key;
            };
            this.setActivationKeyAlt = function (alt) {
                peekerHotKey.altKey = alt;
            };
            this.setActivationKeyCtrl = function (ctrl) {
                peekerHotKey.ctrlKey = ctrl;
            };
            this.setActivationKeyShift = function (shift) {
                peekerHotKey.shiftKey = shift;
            };
            this.setActivationConfiguration = function (configObj) {
                for (var key in configObj) {
                    if (configObj.hasOwnProperty(key)) {
                        peekerHotKey[key] = configObj[key];
                    }
                }
            };

            this.$get = function () {
                return {
                    peekerHotKey: peekerHotKey
                };
            };
        }
    ]);
