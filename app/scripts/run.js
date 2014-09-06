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

