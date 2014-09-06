angular.module('angularPeeker')
    .run([
        '$templateCache',
        function ($templateCache) {
            // Create watcher template
            var watcherHtml = '' +
                '<h1>Watcher</h1>' +
                '<h2>' +
                'This is a watcher' +
                '</h2>';

            $templateCache.put('watcher.html', watcherHtml);

            //peeker strip
            var peekerStrip = '<div class="angularpeeker peeker_strip underBottom">Angular-Peeker is active</div>';
            $templateCache.put('peeker-strip.html', peekerStrip);
        }
    ]);
