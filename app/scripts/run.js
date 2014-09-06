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

