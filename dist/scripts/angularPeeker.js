(function(){
'use strict';
// Source: app/scripts/app.js
/**
 * @ngdoc overview
 * @name angularPeeker
 * @description
 * # angularPeeker
 *
 * Main module of the application.
 */

angular.module('angularPeeker', []);


// Source: app/scripts/directives/peekerStrip.js
angular.module('angularPeeker')
    .directive('peekerStrip', [
        '$timeout',
        function ($timeout) {
            return {
                restrict: 'E',
                templateUrl: 'peeker-strip.html',
                controller: function ($scope, $element, $attrs) {
                    $scope.removeStrip = function () {
                        angular.element($element[0].querySelector('.peeker_strip')).addClass('underBottom').removeClass('bottom');
                        $timeout(function () {
                            $element.remove();
                        }, 1200);
                    };

                    $scope.$on('angularpeeker:peeker:peekerdeactivated', function () {
                        $scope.removeStrip();
                    });
                },
                link: function (scope, element) {
                    setTimeout(function () {
                        angular.element(element[0].querySelector('.peeker_strip')).addClass('bottom').removeClass('underBottom');
                    }, 200);
                }
            };
        }]);

// Source: app/scripts/directives/watcher.js
angular.module('angularPeeker')
    .directive('watcher', [
        'ScopeShow',
        function (ScopeShow) {
            var doc;


            return {
                restrict: 'E',
                templateUrl: 'watcher.html',
                controller: function ($scope, $element, $attrs) {
                    $scope.toggleShow = function () {
                        if ($element[0].style.opacity === '1') {
                            $element[0].style.opacity = '0.1';
                        } else {
                            $element[0].style.opacity = '1';
                        }
                    };
                },
                link: function (scope, element) {
                    var link = ScopeShow.createDisplayModel(
                        scope.selectedScope,
                        null,
                        'selectedScope');
                    doc = link(scope);
                    element[0].querySelector('.angular_peeker_container').appendChild(doc[0]);
                }
            };
        }]);

// Source: app/scripts/run.js
angular.module('angularPeeker')
    .run([
        'peeker',
        function (peeker) {
        }
    ]);


// Source: app/scripts/services/config.js
/**
 * @ngdoc service
 * @name angularPeeker.config
 * @description
 * # config
 * Value in the angularPeeker.
 */
angular.module('angularPeeker')
    .provider('config', [
        function () {
            var peekerHotKey = {
                key: 'p',
                altKey: true,
                shiftKey: false,
                ctrlKey: true
            };

            var queryDepth = 5;

            // Public API for configuration
            this.setActivationKey = function (key) {
                peekerHotKey.key = key;
            };
            this.setActivationKeyAlt = function (alt) {
                peekerHotKey.altKey = alt;
            };
            this.setActivationKeyCtrl = function (ctrl) {
                peekerHotKey.ctrlKey = ctrl;
            };
            this.setActivationKeyShift = function (shift) {
                peekerHotKey.shiftKey = shift;
            };
            this.setActivationConfiguration = function (configObj) {
                for (var key in configObj) {
                    if (configObj.hasOwnProperty(key)) {
                        peekerHotKey[key] = configObj[key];
                    }
                }
            };

            this.getQueryDepth = function () {
                return queryDepth;
            };

            this.setQueryDepth = function (val) {
                queryDepth = val;
                return queryDepth;
            };

            this.$get = function () {
                return {
                    peekerHotKey: peekerHotKey,
                    queryDepth: queryDepth
                };
            };
        }
    ]);

// Source: app/scripts/services/logger.js
/**
 * @ngdoc service
 * @name angularPeeker.logger
 * @description
 * # logger
 * Factory in the angularPeeker.
 */
angular.module('angularPeeker')
    .factory('logger', function () {
        var config = {
            basicInfo: {
                background: '#FFFF66',
                color: '000'
            }
        };

        var buildColorString = function (name) {
            return 'background: ' + config[name].background + ';color: ' + config[name].color;
        };

        var convertArgumentsToArray = function (args, sliceFrom) {
            return Array.prototype.slice.call(args, sliceFrom);
        };

        var logWColor = function (str, color) {
            console.log(str, color);
        };

        var cLogArr = function (args) {
            args.forEach(function (arg) {
                console.log(arg);
            });
        };

        var api = {
            basicInfo: function () {
                var firstArg = '%c' + arguments[0];
                logWColor(firstArg, buildColorString('basicInfo'));
                var args = convertArgumentsToArray(arguments, 1);
                cLogArr(args);
            }
        };

        // Public API here
        return {
            l: api.basicInfo
        };
    });

// Source: app/scripts/services/peeker.js
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
                function ($rootScope, $window, $compile, config, logger) {

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

                    var activateSelector = function () {
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

                    };

                    var deactivateSelector = function () {
                        mouseOverListenerRemover();
                        mouseOutListenerRemover();
                        clickListenerRemover();
                        angular.element(html).removeClass('angularpeeker_peekerActivated');
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


                        //remove all angularpeeker_elementHovered classes
                        var elems = document.getElementsByClassName('angularpeeker_elementHovered');
                        elems = Array.prototype.slice.call(elems);
                        elems.forEach(function (elem) {
                            angular.element(elem).removeClass('angularpeeker_elementHovered');
                        });

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

                        var watcher = $compile('<watcher></watcher>')(newScope);
                        angular.element(body).append(watcher);


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

                    return new Peeker();
                }];
        }]);

// Source: app/scripts/services/scopeShow.js
(function () {
/**
     * @ngdoc service
     * @name angularPeeker.ScopeShow
     * @description
     * # ScopeShow
     * Provider in the angularPeeker.
     */
    angular.module('angularPeeker')
        .provider('ScopeShow', function () {

            // Method for instantiating
            this.$get = [
                'config',
                '$compile',
                function (config, $compile) {


                    //===========================
                    //      Private Methods     =
                    //===========================
                    var getNameFromPath = function (path) {
                        var names = path.split('.');
                        if (names) {
                            return names[names.length - 1];
                        } else {
                            return '';
                        }
                    };

                    var createElementWrapper = function (elType, className) {
                        var wrapper = document.createElement(elType);
                        wrapper.className = className;
                        return wrapper;
                    };

                    var createLabelSpan = function (text) {
                        var label = createElementWrapper('span', 'angularpeeker label_wrapper');
                        label.innerHTML = text;
                        return label;
                    };

                    var createObjDivWrapper = function () {
                        return createElementWrapper('div', 'angularpeeker object_div_wrapper');
                    };

                    var createArrayDivWrapper = function () {
                        return createElementWrapper('div', 'angularpeeker array_div_wrapper');
                    };

                    var createFunctionDivWrapper = function () {
                        return createElementWrapper('div', 'angularpeeker function_div_wrapper');
                    };

                    var createPrimitiveWrapper = function (path, type) {
                        var inp = createElementWrapper('input', 'angularpeeker primitive_wrapper ' + type);
                        angular.element(inp).attr('ng-model', path);
                        return inp;
                    };


                    var typeDetector = [
                        {
                            type: 'string',
                            checkMethod: function (val) {
                                return angular.isString(val);
                            }
                        },
                        {
                            type: 'number',
                            checkMethod: function (val) {
                                return angular.isNumber(val);
                            }
                        },
                        {
                            type: 'boolean',
                            checkMethod: function (val) {
                                return (val === true || val === false);
                            }
                        },
                        {
                            type: 'array',
                            checkMethod: function (val) {
                                return angular.isArray(val);
                            }
                        },
                        {
                            type: 'function',
                            checkMethod: function (val) {
                                return angular.isFunction(val);
                            }
                        },
                        {
                            type: 'object',
                            checkMethod: function (val) {
                                return angular.isObject(val);
                            }
                        },
                        {
                            type: 'null',
                            checkMethod: function (val) {
                                return val === null;
                            }
                        }
                    ];
                    var getType = function (val) {
                        var i;
                        for (i = 0; i < typeDetector.length; i += 1) {
                            if (typeDetector[i].checkMethod(val)) {
                                return typeDetector[i].type;
                            }
                        }
                    };

                    var displayModelActions = {
                        'baseName': function (path) {
                            // Get The name
                            var name = getNameFromPath(path);

                            // ignore private variables
                            if (name.indexOf('$$') === 0 || name.indexOf('__') === 0) {
                                return false;
                            }
                            return name;
                        },
                        'setIndentClass': function (element, indent) {
                            angular.element(element).addClass('indent' + indent);
                        },
                        'baseCreateElements': function (name, wrapper, doc, path, depth) {
                            doc.appendChild(wrapper);
                            var label = createLabelSpan(name);
                            wrapper.appendChild(label);
                            wrapper.pathName = path;
                            displayModelActions.setIndentClass(wrapper, depth);
                            displayModelActions.setIndentClass(label, depth);
                        },
                        'object': function (obj, doc, path, depth) {
                            var name = displayModelActions.baseName(path);
                            if (name === false) {
                                return;
                            }
                            var wrapper = createObjDivWrapper();
                            displayModelActions.baseCreateElements(name, wrapper, doc, path, depth);


                            var key;
                            for (key in obj) {
                                if (obj.hasOwnProperty(key) && key !== 'this' && key !== '$parent') {
                                    ScopeShow.prototype.createDisplayModel(obj[key], wrapper, path + '.' + key, depth);
                                }
                            }
                        },
                        'array': function (arr, doc, path, depth) {
                            // Get The name
                            var name = displayModelActions.baseName(path);
                            if (name === false) {
                                return;
                            }

                            var wrapper = createArrayDivWrapper();
                            displayModelActions.baseCreateElements(name, wrapper, doc, path, depth);

                            arr.forEach(function (item, index) {
                                ScopeShow.prototype.createDisplayModel(item, wrapper, path + '[' + index + ']', depth);
                            });

                        },
                        'function': function (func, doc, path, depth) {
                            // Get The name
                            var name = displayModelActions.baseName(path);
                            if (name === false) {
                                return;
                            }

                            var wrapper = createFunctionDivWrapper();
                            displayModelActions.baseCreateElements(name, wrapper, doc, path, depth);
                        },
                        'primitive': function (doc, path, type, depth) {
                            // Get The name
                            var name = displayModelActions.baseName(path);
                            if (name === false) {
                                return;
                            }

                            var wrapper = createElementWrapper('div', 'angularpeeker generic_wrapper');
                            displayModelActions.baseCreateElements(name, wrapper, doc, path, depth);
                            var inp = createPrimitiveWrapper(path, type);
                            wrapper.appendChild(inp);
                        },
                        'string': function (str, doc, path, depth) {
                            displayModelActions.primitive(doc, path, 'string', depth);
                        },
                        'number': function (str, doc, path, depth) {
                            displayModelActions.primitive(doc, path, 'number', depth);
                        },
                        'boolean': function (str, doc, path, depth) {
                            displayModelActions.primitive(doc, path, 'boolean', depth);
                        },
                        'null': function (str, doc, path, depth) {
                            displayModelActions.primitive(doc, path, 'null', depth);
                        }
                    };

                    //===========================
                    //      Private Constructor =
                    //===========================
                    var ScopeShow = function () {
                    };


                    ScopeShow.prototype.createDisplayModel = function (model, doc, path, depth) {
                        // Create doc if it wasn't passed
                        doc = (doc) ? doc : createObjDivWrapper();
                        // Set the depth
                        depth = (depth !== undefined && depth !== null) ? depth : 0;

                        // Set a compile on depth 0
                        var toCompile = (depth === 0);

                        // Check if depth not exceeded
                        if (depth < config.queryDepth) {
                            depth += 1;
                        } else {
                            return;
                        }

                        // Get the type
                        var modelType = getType(model);
                        if (modelType) {
                            displayModelActions[modelType](model, doc, path, depth);
                        }

                        if (toCompile) {
                            return $compile(doc);
                        }

                    };

                    return new ScopeShow();
                }
            ];
        });
}());
// Source: app/scripts/templateCache.js
angular.module('angularPeeker')
    .run([
        '$templateCache',
        function ($templateCache) {
            // Create watcher template
            var watcherHtml = '<div class="angular_peeker_container">' +
                '<div class="buttons_group">' +
                '<button class="opacity_button" ng-click="toggleOpacity()" style="opacity: 1;">Opac</button>' +
                '<button class="close_button" ng-click="deactivatePeeker()">x</button>' +
                '<button class="toggleSelector_button" ng-click="toggleSelector()">o</button>' +
                '</div>' +
                '</div>';

            $templateCache.put('watcher.html', watcherHtml);

            //peeker strip
            var peekerStrip = '<div class="angularpeeker peeker_strip underBottom">Angular-Peeker is active</div>';
            $templateCache.put('peeker-strip.html', peekerStrip);
        }
    ]);

}());