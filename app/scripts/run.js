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

            $window.addEventListener('keydown', function (evt) {
                var keyCode = config.peekerHotKey.key.toUpperCase().charCodeAt(0);
                if ((evt.keyCode === keyCode) &&
                    (evt.altKey === config.peekerHotKey.altKey) &&
                    (evt.shiftKey === config.peekerHotKey.shiftKey) &&
                    (evt.ctrlKey === config.peekerHotKey.ctrlKey)) {
                    logger.l('Peeker Activated!');
                }
            }, false);
        }
    ]);

