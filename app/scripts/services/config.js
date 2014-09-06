/**
 * @ngdoc service
 * @name angularPeeker.config
 * @description
 * # config
 * Value in the angularPeeker.
 */
angular.module('angularPeeker')
  .value('config', {
        peekerHotKey: {
            key: 'p',
            altKey: true,
            shiftKey: false,
            ctrlKey: true
        }
    });
