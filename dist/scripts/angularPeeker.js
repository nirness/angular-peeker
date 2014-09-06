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
        '$rootScope',
        '$window',
        'config',
        'logger',
        function ($rootScope, $window, config, logger) {
            logger.l('angularPeeker: run: $rootScope', $rootScope);
            logger.l('angularPeeker: run: $window', $window);
            logger.l('angularPeeker: run: config', config);

            // Activates peeker on selected key
            $window.addEventListener('keydown', function (evt) {
                var keyCode = config.peekerHotKey.key.toUpperCase().charCodeAt(0);
                if ((evt.keyCode === keyCode) &&
                    (evt.altKey === config.peekerHotKey.altKey) &&
                    (evt.shiftKey === config.peekerHotKey.shiftKey) &&
                    (evt.ctrlKey === config.peekerHotKey.ctrlKey)) {
                    logger.l('Peeker Activated!');
                    $rootScope.$broadcast('angularpeeker:run:peekeractivated');
                }
            }, false);


            // When peeker activetd
            $rootScope.$on('angularpeeker:run:peekeractivated', function () {
                var body = document.getElementsByTagName('body')[0];
                logger.l('Add class \'peekerActivated\' to body', body);
                angular.element(body).addClass('peekerActivated');
            });
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

// Source: app/scripts/services/logger.js
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
        };

        var buildColorString = function (name) {
            return 'background: ' + config[name].background + ';color: ' + config[name].color;
        };

        var convertArgumentsToArray = function (args, sliceFrom) {
            return Array.prototype.slice.call(args, sliceFrom);
        };

        var logWColor = function (str, color) {
            console.log(str, color);
        };

        var cLogArr = function (args) {
            args.forEach(function (arg) {
                console.log(arg);
            });
        };

        var api = {
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