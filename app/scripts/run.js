angular.module('angularPeeker')
    .run([
        '$rootScope',
        '$window',
        'config',
        'logger',
        'peeker',
        function ($rootScope, $window, config, logger, peeker) {
            logger.l('angularPeeker: run: $rootScope', $rootScope);
            logger.l('angularPeeker: run: $window', $window);
            logger.l('angularPeeker: run: config', config);
            logger.l('angularPeeker: run: peeker', peeker);

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
                var html = document.getElementsByTagName('html')[0];

                logger.l('Add class \'angularpeeker_peekerActivated\' to html', body);
                angular.element(html).addClass('angularpeeker_peekerActivated');

                $window.addEventListener('mouseover', function (evt) {
                    logger.l('Mouse over: ', evt);
                    angular.element(evt.srcElement).addClass('angularpeeker_elementHovered');
                }, true);

                $window.addEventListener('mouseout', function (evt) {
                    logger.l('Mouse out: ', evt);
                    angular.element(evt.srcElement).removeClass('angularpeeker_elementHovered');
                }, true);

                $window.addEventListener('click', function (evt) {
                    evt.stopImmediatePropagation();

                }, true);
            });
        }
    ]);

