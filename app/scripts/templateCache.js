angular.module('angularPeeker')
    .run([
        '$templateCache',
        function ($templateCache) {
            // Create watcher template
            var scopeViewerHtml = '<div class="angular_peeker_container"></div>';

            $templateCache.put('scopeViewer.html', scopeViewerHtml);

            //peeker strip
            var peekerStrip = '' +
                '<div class="angularpeeker peeker_strip underBottom">' +
                '<span class="header">Angular-Peeker</span>' +
                '<div class="buttons_group">' +
                '<div ' +
                'id="toggle_scopeViewer" ' +
                'class="button live_gradient_yellow"' +
                'ng-bind="scopeViewerState"' +
                'ng-class="{disabled: !scopeViewerActive}"' +
                'ng-click="toggleShowHideState()"' +
                '>Hide</div>' +
                '<div ' +
                'id="Select" ' +
                'class="button live_gradient_yellow"' +
                'ng-class="{disabled: selectorActive}"' +
                'ng-click="activateSelector($event)"' +
                '>Select</div>' +
                '</div>' +
                '</div>';
            $templateCache.put('peeker-strip.html', peekerStrip);
        }
    ]);
