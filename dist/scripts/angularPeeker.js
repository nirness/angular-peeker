(function(){
'use strict';
// Source: app/scripts/app.js
/**
 * @ngdoc overview
 * @name angularPeeker
 * @description
 * # angularPeeker
 *
 * Main module of the application.
 */

angular.module('angularPeeker', []);


// Source: app/scripts/run.js
angular.module('angularPeeker')
    .run([
        '$window',
        'config',
        function ($window, config) {
            $window.addEventListener('keydown', function (evt) {
                console.log(arguments);
                var keyCode = config.peekerHotKey.key.toUpperCase().charCodeAt(0);
                if ((evt.keyCode === keyCode) &&
                    (evt.altKey === config.peekerHotKey.altKey) &&
                    (evt.shiftKey === config.peekerHotKey.shiftKey) &&
                    (evt.ctrlKey === config.peekerHotKey.ctrlKey)) {
                    console.log('Peeker Activated!');
                }
            }, false);
        }
    ]);


// Source: app/scripts/services/config.js
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

}());