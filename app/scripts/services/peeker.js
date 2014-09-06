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
                'config',
                'logger',
                function ($rootScope, $window, config, logger) {
                    logger.l('angularPeeker: run: $rootScope', $rootScope);
                    logger.l('angularPeeker: run: $window', $window);
                    logger.l('angularPeeker: run: config', config);


                    //===============================
                    //      Private variables       =
                    //===============================
                    var peekerActivated = false;
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

                    var activatePeeker = function () {

                        $rootScope.$broadcast('angularpeeker:run:peekeractivated');

                        logger.l('Add class \'angularpeeker_peekerActivated\' to html', body);
                        angular.element(html).addClass('angularpeeker_peekerActivated');

                        on({
                            eventType: 'mouseover',
                            handler: function (evt) {
                                angular.element(evt.srcElement).addClass('angularpeeker_elementHovered');
                            },
                            capturePahse: true
                        });

                        on({
                            eventType: 'mouseout',
                            handler: function (evt) {
                                angular.element(evt.srcElement).removeClass('angularpeeker_elementHovered');
                            },
                            capturePahse: true
                        });

                        on({
                            eventType: 'click',
                            handler: function (evt) {
                                evt.stopImmediatePropagation();
                                displayScope(evt);
                            },
                            capturePahse: true
                        });

                    };

                    var deactivatePeeker = function () {
                        $rootScope.$broadcast('angularpeeker:run:peekerdeactivated');

                        logger.l('Remove class \'angularpeeker_peekerActivated\' to html', body);
                        angular.element(html).removeClass('angularpeeker_peekerActivated');

                        //remove all angularpeeker_elementHovered classes

                        var elems = document.getElementsByClassName('angularpeeker_elementHovered');
                        elems = Array.prototype.slice.call(elems);
                        elems.forEach(function (elem) {
                            angular.element(elem).removeClass('angularpeeker_elementHovered');
                        });

                        removeEventListeners();
                    };

                    var toggleActive = function () {
                        if (!peekerActivated) {
                            activatePeeker();
                            logger.l('Peeker activated!');
                        } else {
                            deactivatePeeker();
                            logger.l('Peeker dectivated!');
                        }
                        peekerActivated = !peekerActivated;
                    };

                    var displayScope = function (evt) {
                        logger.l('Selected element source: ', evt.srcElement);
                        logger.l('Selected scope: ', getScope(evt.srcElement));

                        var selectedScope = getScope(evt.srcElement);

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

                    // When peeker activetd
                    $rootScope.$on('angularpeeker:run:peekeractivated', function () {

                    });

                    return new Peeker();
                }];
        }]);
