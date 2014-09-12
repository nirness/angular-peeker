'use strict';

/**
 * @ngdoc service
 * @name angularPeeker.peeker
 * @description
 * # peeker
 * Provider in the angularPeeker.
 */
angular.module('angularPeeker')
    .provider('peeker', [
        function () {

            // Method for instantiating
            this.$get = [
                '$rootScope',
                '$window',
                '$compile',
                'config',
                'logger',
                'domActions',
                function ($rootScope, $window, $compile, config, logger, domActions) {

                    //===============================
                    //      Private variables       =
                    //===============================
                    var peekerActivated = false, selectorActivated = false;
                    var mouseOverListenerRemover, mouseOutListenerRemover, clickListenerRemover;
                    var body = document.getElementsByTagName('body')[0];
                    var html = document.getElementsByTagName('html')[0];
                    var eventListenersRemovers = [];

                    //===============================
                    //      Private Methods         =
                    //===============================


                    var getScope = function (elem) {
                        return angular.element(elem).scope();
                    };

                    var removeEventListeners = function () {
                        eventListenersRemovers.forEach(function (remover) {
                            remover();
                        });
                        eventListenersRemovers = [];
                    };

                    var on = function (configObj) {
                        configObj.obj = configObj.obj !== undefined ? configObj.obj : $window;
                        configObj.apturePhase = configObj.capturePhase !== undefined ? configObj.capturePhase : false;
                        configObj.obj.addEventListener(configObj.eventType, configObj.handler, configObj.capturePhase);

                        var remover = function () {
                            configObj.obj.removeEventListener(configObj.eventType, configObj.handler, configObj.capturePhase);
                        };

                        eventListenersRemovers.push(remover);

                        return remover;
                    };

                    var removeElementHoveredClass = function () {
                        var elements = domActions.find('.angularpeeker_elementHovered');
                        domActions.removeClass('angularpeeker_elementHovered', elements);
                    };

                    var activateSelector = function () {
                        // Set class angularpeeker_peekerActivated if html does not have that class
                        if (html.className.indexOf('angularpeeker_peekerActivated') === -1) {
                            angular.element(html).addClass('angularpeeker_peekerActivated');
                        }

                        // remove all angularpeeker_elementHovered classes from dom
                        removeElementHoveredClass();

                        mouseOverListenerRemover = on({
                            eventType: 'mouseover',
                            handler: function (evt) {
                                angular.element(evt.srcElement).addClass('angularpeeker_elementHovered');
                            },
                            capturePahse: true
                        });

                        mouseOutListenerRemover = on({
                            eventType: 'mouseout',
                            handler: function (evt) {
                                angular.element(evt.srcElement).removeClass('angularpeeker_elementHovered');
                            },
                            capturePahse: true
                        });

                        clickListenerRemover = on({
                            eventType: 'click',
                            handler: function (evt) {
                                evt.stopImmediatePropagation();
                                displayScope(evt);
                                deactivateSelector();
                            },
                            capturePahse: true
                        });

                        $rootScope.$broadcast('angularpeeker:peeker:selectoractivated');

                    };

                    var deactivateSelector = function () {
                        mouseOverListenerRemover();
                        mouseOutListenerRemover();
                        clickListenerRemover();
                        angular.element(html).removeClass('angularpeeker_peekerActivated');

                        $rootScope.$broadcast('angularpeeker:peeker:selectordeactivated');
                    };

                    var toggleSelector = function () {
                        if (!selectorActivated) {
                            activateSelector();
                        } else {
                            deactivateSelector();
                        }
                        selectorActivated = !selectorActivated;
                    };

                    var activatePeeker = function () {

                        $rootScope.$broadcast('angularpeeker:peeker:peekeractivated');

                        angular.element(html).addClass('angularpeeker_peekerActivated');

                        //Display active strip
                        var activeStrip = $compile('<peeker-strip></peeker-strip>')($rootScope);
                        angular.element(body).append(activeStrip);

                        activateSelector();
                    };

                    var deactivatePeeker = function () {
                        $rootScope.$broadcast('angularpeeker:peeker:peekerdeactivated');

                        // remove all angularpeeker_elementHovered classes from dom
                        removeElementHoveredClass();

                        removeEventListeners();

                        deactivateSelector();

                    };

                    var toggleActive = function () {
                        if (!peekerActivated) {
                            activatePeeker();
                        } else {
                            deactivatePeeker();
                        }
                        peekerActivated = !peekerActivated;
                    };


                    var displayScope = function (evt) {
                        var newScope = $rootScope.$new(true);
                        newScope.selectedScope = getScope(evt.srcElement);
                        newScope.selectedElement = angular.element(evt.srcElement);

                        var watcher = $compile('<scope-viewer></scope-viewer>')(newScope);
                        angular.element(body).append(watcher);

                        $rootScope.$broadcast('angularpeeker:peeker:scopevieweractivated');

                    };


                    //===============================
                    //      Private Constructor     =
                    //===============================
                    var Peeker = function () {
                    };


                    //===============================
                    //      Private init            =
                    //===============================
                    $window.addEventListener('keydown', function (evt) {
                        var keyCode = config.peekerHotKey.key.toUpperCase().charCodeAt(0);
                        if ((evt.keyCode === keyCode) &&
                            (evt.altKey === config.peekerHotKey.altKey) &&
                            (evt.shiftKey === config.peekerHotKey.shiftKey) &&
                            (evt.ctrlKey === config.peekerHotKey.ctrlKey)) {

                            toggleActive();
                        }
                    }, false);


                    //===========================
                    //      Listeners           =
                    //===========================
                    $rootScope.$on('angularpeeker:peekerstrip:requestselectoractivate', function () {
                        activateSelector();
                    });

                    return new Peeker();
                }];
        }]);
