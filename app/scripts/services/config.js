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
            this.peekerHotKey = {
                key: 'p',
                altKey: true,
                shiftKey: false,
                ctrlKey: true
            };

            this.$get = function () {
                return {
                    peekerHotKey: this.peekerHotKey
                };
            };
        }
    ]);
