angular.module('angularPeeker')
    .run([
        '$window',
        function ($window) {
            $window.addEventListener('keydown', function (event) {
                console.log(arguments);

            }, false);
        }
    ]);

