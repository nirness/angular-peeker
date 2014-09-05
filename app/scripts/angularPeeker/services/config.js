'use strict';

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
            alt: true,
            control: true,
            shift: false
        }
    });
