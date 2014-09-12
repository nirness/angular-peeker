(function () {
    'use strict';
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
                    },
                    queryDepth = 5;

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
                    var key;

                    for (key in configObj) {
                        if (configObj.hasOwnProperty(key)) {
                            peekerHotKey[key] = configObj[key];
                        }
                    }
                };

                this.getQueryDepth = function () {
                    return queryDepth;
                };

                this.setQueryDepth = function (val) {
                    queryDepth = val;
                    return queryDepth;
                };

                this.$get = function () {
                    return {
                        peekerHotKey: peekerHotKey,
                        queryDepth: queryDepth
                    };
                };
            }
        ]);
}());