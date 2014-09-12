angular.module('angularPeeker')
    .run([
        '$templateCache',
        function ($templateCache) {
            // Create watcher template
            var scopeViewerHtml = '<div class="angular_peeker_container">' +
                '<div class="buttons_group">' +
                '<button class="opacity_button" ng-click="toggleOpacity()" style="opacity: 1;">Opac</button>' +
                '<button class="close_button" ng-click="deactivatePeeker()">x</button>' +
                '<button class="toggleSelector_button" ng-click="toggleSelector()">o</button>' +
                '</div>' +
                '</div>';

            $templateCache.put('scopeViewer.html', scopeViewerHtml);

            //peeker strip
            var peekerStrip = '<div class="angularpeeker peeker_strip underBottom">Angular-Peeker is active</div>';
            $templateCache.put('peeker-strip.html', peekerStrip);
        }
    ]);
