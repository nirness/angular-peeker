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


// Source: app/scripts/directives/methodviewer.js
(function () {
/**
     * @ngdoc directive
     * @name angularPeeker.directive:methodViewer
     * @description
     * # methodViewer
     */
    angular.module('angularPeeker')
        .directive('methodViewer', [
            'domActions',
            function (domActions) {
                return {
                    templateUrl: 'method-viewer.html',
                    restrict: 'E',
                    scope: {
                        methodName: '=',
                        selectedScope: '='
                    },
                    link: function postLink (scope, element, attrs) {
                        var div = domActions.find('.method_content', element)[0];
                        div.innerHTML = '<pre>' + (scope.selectedScope[scope.methodName] || null).toString() + '</pre>';

                        scope.remove = function () {
                            element.remove();
                        };
                    }
                };
            }]);
}());
// Source: app/scripts/directives/peekerStrip.js
angular.module('angularPeeker')
    .directive('peekerStrip', [
        '$rootScope',
        '$timeout',
        function ($rootScope, $timeout) {
            return {
                restrict: 'E',
                templateUrl: 'peeker-strip.html',
                controller: function ($scope, $element, $attrs) {
                    // Init
                    $scope.scopeViewerState = 'Hide';
                    $scope.scopeViewerActive = false;
                    $scope.selectorActive = true;

                    $scope.toggleShowHideText = function () {
                        $scope.scopeViewerState = $scope.scopeViewerState === 'Hide' ? 'Show' : 'Hide';
                    };

                    $scope.toggleShowHideState = function () {
                        $rootScope.$broadcast('angularpeeker:peekerstrip:requesttogglestate', $scope.scopeViewerState);
                        $scope.toggleShowHideText();
                    };

                    $scope.activateSelector = function ($event) {
                        // Prevent the click event from becoming the selector target
                        $event.preventDefault();
                        $event.stopPropagation();

                        // Set the strips state params
                        $scope.scopeViewerState = 'Hide';
                        $scope.scopeViewerActive = false;

                        // Broadcast requestdestroyviewer To destroy the scope viewer
                        $rootScope.$broadcast('angularpeeker:peekerstrip:requestdestroyviewer', $scope.scopeViewerState);

                        // Broadcast requestselectoractivate To activate the element selector
                        $rootScope.$broadcast('angularpeeker:peekerstrip:requestselectoractivate', $scope.scopeViewerState);
                    };

                    $scope.removeStrip = function () {
                        angular.element($element[0].querySelector('.peeker_strip')).addClass('underBottom').removeClass('bottom');
                        $timeout(function () {
                            $element.remove();
                        }, 1200);
                    };


                    //Setup scope listeners
                    $scope.$on('angularpeeker:peeker:scopevieweractivated', function () {
                        $scope.scopeViewerActive = true;
                    });

                    $scope.$on('angularpeeker:peeker:peekerdeactivated', function () {
                        $scope.removeStrip();
                    });

                    $scope.$on('angularpeeker:peeker:selectoractivated', function () {
                        $scope.selectorActive = true;
                    });

                    $scope.$on('angularpeeker:peeker:selectordeactivated', function () {
                        $scope.selectorActive = false;
                    });
                },
                link: function (scope, element) {
                    setTimeout(function () {
                        angular.element(element[0].querySelector('.peeker_strip')).addClass('bottom').removeClass('underBottom');
                    }, 200);

                }
            };
        }]);

// Source: app/scripts/directives/scopeViewer.js
(function () {
angular.module('angularPeeker')
        .directive('scopeViewer', [
            'scopeViewBuilder',
            'methodInvoker',
            '$compile',
            function (scopeViewBuilder, methodInvoker, $compile) {
                var viewer;

                return {
                    restrict: 'E',
                    templateUrl: 'scopeViewer.html',
                    controller: function ($scope, $element, $attrs) {
                        // $scope methods
                        //===============
                        $scope.invokeMethod = function (methodName) {
                            methodInvoker.invoke($scope.selectedScope, methodName);
                        };

                        $scope.viewMethod = function (name) {
                            var view = '<method-viewer method-name="\'' + name +
                                '\'" selected-scope="selectedScope"></method-viewer>';
                            var dom = $compile(view)($scope);
                            document.body.appendChild(dom[0]);
                        };

                        // Cleanup
                        $element.on('$destroy', function () {
                            $scope = null;
                        });
                    },
                    link: function (scope, element) {


                        // scope methods
                        //==============
                        scope.destroyViewer = function () {
                            element.remove();
                            viewer = null;
                        };

                        scope.appendViewer = function () {
                            element[0].querySelector('.angular_peeker_container').appendChild(viewer[0]);
                        };

                        scope.hideElement = function () {
                            element[0].style.display = 'none';
                        };

                        scope.showElement = function () {
                            element[0].attributes.removeNamedItem('style');
                        };


                        // Init
                        //=======

                        // Build the scope view and get a link function
                        var link = scopeViewBuilder.buildScopeView(
                            scope.selectedScope, // The selected scope
                            null, // No original doc
                            'selectedScope' // The name of the original property
                        );
                        // Run the link function
                        viewer = link(scope);
                        // Append the result document to angular_peeker_container
                        scope.appendViewer();


                        // Set scope listeners
                        scope.$on('angularpeeker:peekerstrip:requesttogglestate', function (evt, data) {
                            if (data.toLowerCase() === 'hide') {
                                scope.hideElement();
                            } else {
                                scope.showElement();
                            }
                        });

                        scope.$on('angularpeeker:peekerstrip:requestdestroyviewer', function () {
                            scope.destroyViewer();
                        });
                    }
                };
            }]);
}());
// Source: app/scripts/run.js
angular.module('angularPeeker')
    .run([
        'peeker',
        function (peeker) {
        }
    ]);


// Source: app/scripts/services/config.js
(function () {
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
                    },
                    queryDepth = 5;

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
                    var key;

                    for (key in configObj) {
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
}());
// Source: app/scripts/services/domActions.js
(function () {
/**
     * @ngdoc service
     * @name angularPeeker.domActions
     * @description
     * # domActions
     * factory in the angularPeeker.
     */
    angular.module('angularPeeker')
        .factory('domActions', function () {
            var html = document.getElementsByTagName('html')[0],
                body = document.getElementsByTagName('body')[0],
                factory = {
                    /**
                     *
                     * @param elems
                     * @returns {string}
                     */
                    getElementsType: function (elems) {
                        if (elems instanceof Array) {
                            return 'Array';
                        }
                        if (elems instanceof NodeList || elems instanceof HTMLCollection) {
                            return 'NodeList';
                        }
                        if (elems instanceof Node) {
                            return 'Node';
                        }
                        if (elems.scope && elems.injector && elems.length !== undefined) {
                            return 'angular';
                        }
                        if (typeof elems === 'string') {
                            return 'string';
                        }
                    },
                    convertElemsToArray: {
                        /**
                         *
                         * @param elems {Array}
                         * @returns {*}
                         */
                        'Array': function (elems) {
                            return elems;
                        },
                        /**
                         *
                         * @param elems {NodeList}
                         * @returns {*|Array.<T>}
                         */
                        'NodeList': function (elems) {
                            return Array.prototype.slice.call(elems);
                        },
                        /**
                         *
                         * @param elem {Node}
                         * @returns {Array|[]}
                         */
                        'Node': function (elem) {
                            return [elem];
                        },
                        /**
                         *
                         * @param elems
                         * @returns {Array|[]}
                         */
                        'angular': function (elems) {
                            var length = elems.length,
                                arr = [],
                                i;

                            for (i = 0; i < length; i += 1) {
                                arr.push(elems[i]);
                            }

                            return arr;
                        },
                        /**
                         *
                         * @param str
                         * @returns {Array|[]}
                         */
                        'string': function (str) {
                            var arr = [],
                                elm;
                            elm = angular.element(str);

                            if (elm.length) {
                                arr.push(elm);
                            }

                            return arr;
                        },
                        /**
                         *
                         * @param elems
                         * @returns {Array|[]}
                         */
                        convert: function (elems) {
                            // Find the element type
                            var elmType = factory.getElementsType(elems);
                            // Convert the element to array
                            return factory.convertElemsToArray[elmType](elems);
                        }
                    },
                    /**
                     *
                     * @param selector {string} The selector string
                     * @param element {*}
                     * @returns {Array} array of node elements
                     */
                    find: function (selector, element) {
                        // Set element as received or as html default
                        element = element || html;
                        var elementsArr = [],
                            arr = factory.convertElemsToArray.convert(element);

                        // Iterate through the array
                        arr.forEach(function (member) {
                            // Parse onle Node elements
                            if (factory.getElementsType(member) === 'Node') {
                                // Find elements by selector on member
                                var elements = member.querySelectorAll(selector);

                                if (elements) {
                                    // Turn elements into array
                                    elements = Array.prototype.slice.call(elements);
                                    // Push all elements in array to the returned array
                                    elements.forEach(function (elem) {
                                        elementsArr.push(elem);
                                    });
                                }
                            }
                        });

                        return elementsArr;
                    },
                    /**
                     *
                     * @param className {string}
                     * @param elem
                     */
                    removeClass: function (className, elem) {
                        var elems = factory.convertElemsToArray.convert(elem);
                        elems.forEach(function (elem) {
                            angular.element(elem).removeClass(className);
                        });
                    },
                    /**
                     *
                     * @param className {string}
                     * @param elem
                     */
                    addClass: function (className, elem) {
                        var elems = factory.convertElemsToArray.convert(elem);
                        elems.forEach(function (elem) {
                            angular.element(elem).addClass(className);
                        });
                    }

                };

            return factory;
        });

}());
// Source: app/scripts/services/logger.js
(function () {
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
                },

                buildColorString = function (name) {
                    return 'background: ' + config[name].background + ';color: ' + config[name].color;
                },

                convertArgumentsToArray = function (args, sliceFrom) {
                    return Array.prototype.slice.call(args, sliceFrom);
                },

                logWColor = function (str, color) {
                    console.log(str, color);
                },

                cLogArr = function (args) {
                    args.forEach(function (arg) {
                        console.log(arg);
                    });
                },

                api = {
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
}());
// Source: app/scripts/services/methodinvoker.js
(function () {
/**
     * @ngdoc service
     * @name angularPeeker.methodInvoker
     * @description
     * # methodInvoker
     * Factory in the angularPeeker.
     */
    angular.module('angularPeeker')
        .factory('methodInvoker', [
            'domActions',
            function (domActions) {
                var factory = {
                    split: function (str, delimiter, ignoreInJson) {
                        // set ignoreInJson default
                        ignoreInJson = (ignoreInJson !== undefined) ? ignoreInJson : true;
                        // set delimiter default
                        delimiter = (delimiter !== undefined) ? delimiter : ',';

                        // In case of ignore set to true, a manual split is required
                        if (ignoreInJson) {
                            var arr = [],
                                i,
                                ignore = false,
                                jsonSign,
                                builtString = '';

                            // Iterate through th string
                            for (i = 0; i < str.length; i += 1) {
                                // If the char equals the delimiter then push the builtString and set it to empty string
                                if (!ignore && str[i] === delimiter) {
                                    arr.push(builtString);
                                    builtString = '';
                                } else {
                                    // add the char to the builtString
                                    builtString += str[i];

                                    // Check ig the char is a json sign like [ or {
                                    if (str[i] === '{') {
                                        ignore = true;
                                        jsonSign = '{';
                                    } else if (str[i] === '[') {
                                        ignore = true;
                                        jsonSign = '[';
                                    }

                                    // Check if ignore state should be terminated
                                    if (ignore) {
                                        if ((jsonSign === '{' && str[i] === '}') || (jsonSign === '[' && str[i] === ']')) {
                                            ignore = false;
                                            jsonSign = '';
                                        }
                                    }
                                }
                            }
                            // push the final builtString into the arr
                            if (builtString.length > 0) {
                                arr.push(builtString);
                            }
                            return arr;
                        } else {
                            return str.split(delimiter);
                        }
                    },
                    findRelevantThisInputField: function (methodName) {
                        return domActions.find('input.angularpeeker.function_elements.this_field.for_' + methodName)[0];
                    },
                    findRelevantParamsInputField: function (methodName) {
                        return domActions.find('input.angularpeeker.function_elements.params_field.for_' + methodName)[0];
                    },
                    JSONParse: function (value) {
                        var endVal = null,
                            jsonFailed = true;
                        try {
                            endVal = JSON.parse(value);
                            jsonFailed = false;
                        } catch (e) {
                            console.warn('domActions: JSONParse: failed.', e);
                        } finally {
                            if (jsonFailed) {
                                try {
                                    // The only reason eval is used here is because this app is meant for dev environment only.
                                    // As a rule of thumb eval should not be used, but a huge corner was cut here by avoiding
                                    // to write a complicated json parser.
                                    eval('endVal = ' + value);
                                } catch (e) {
                                    console.warn('domActions: JSONParse: eval phase: failed.', e);
                                } finally {
                                    return endVal;
                                }
                            } else {
                                return endVal;
                            }
                        }
                    },
                    getTypedParam: function (scope, paramName) {
                        //validate paramName
                        if (!paramName || paramName.length === 0 || typeof paramName !== 'string') {
                            return null;
                        }

                        //trim paramName
                        paramName = paramName.trim();

                        var startsWith = paramName[0],
                            endsWith = paramName[paramName.length - 1];

                        // Find if its a string
                        if ((startsWith === '\'' && endsWith === '\'') || (startsWith === '"' && endsWith === '"')) {
                            return paramName.substr(1, paramName.length - 2);
                        }

                        // find if its a number
                        if (parseFloat(paramName).toString() === paramName) {
                            return parseFloat(paramName);
                        }

                        // find if its an array
                        if (startsWith === '[' && endsWith === ']') {
                            return factory.JSONParse(paramName);
                        }

                        // find if its an object
                        if (startsWith === '{' && endsWith === '}') {
                            return factory.JSONParse(paramName);
                        }
                        // find if its a variable name
                        if (scope[paramName] !== undefined) {
                            return scope[paramName];
                        }

                        return null;
                    },
                    getParams: function (scope, methodName) {
                        var input = factory.findRelevantParamsInputField(methodName),
                            paramsString = input.value,
                            paramNames = factory.split(paramsString.trim()),
                            args = [];

                        paramNames.forEach(function (paramName) {
                            args.push(factory.getTypedParam(scope, paramName.trim()));

                        });

                        return args;

                    },
                    getThis: function (scope, methodName) {
                        var thatString = factory.findRelevantThisInputField(methodName).value;
                        var that = factory.getTypedParam(scope, thatString) || this;
                        return that;
                    },
                    invoke: function (scope, methodName) {
                        var args = factory.getParams(scope, methodName);
                        var that = factory.getThis(scope, methodName);
                        scope[methodName].apply(that, args);
                    }
                };

                return factory;
            }]);
}());
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

// Source: app/scripts/services/scopeViewBuilder.js
(function () {
/**
     * @ngdoc service
     * @name angularPeeker.scopeViewBuilder
     * @description
     * # scopeViewBuilder
     * Provider in the angularPeeker.
     */
    angular.module('angularPeeker')
        .provider('scopeViewBuilder', [
            function (domActions) {

                // Method for instantiating
                this.$get = [
                    'config',
                    '$compile',
                    'domActions',
                    function (config, $compile, domActions) {


                        //===========================
                        //      Private Methods     =
                        //===========================
                        var getNameFromPath = function (path) {
                                var names = path.split('.');
                                if (names) {
                                    return names[names.length - 1];
                                }

                                return '';
                            },

                            createElementWrapper = function (elType, className) {
                                var wrapper = document.createElement(elType);
                                wrapper.className = className;
                                return wrapper;
                            },

                            createLabelSpan = function (text) {
                                var label = createElementWrapper('span', 'angularpeeker label_wrapper');
                                label.innerHTML = text;
                                return label;
                            },

                            createObjDivWrapper = function () {
                                return createElementWrapper('div', 'angularpeeker object_div_wrapper');
                            },

                            createArrayDivWrapper = function () {
                                return createElementWrapper('div', 'angularpeeker array_div_wrapper');
                            },

                            createFunctionDivWrapper = function () {
                                return createElementWrapper('div', 'angularpeeker function_div_wrapper');
                            },

                            createPrimitiveWrapper = function (path, type) {
                                var inp = createElementWrapper('input', 'angularpeeker primitive_wrapper ' + type);
                                angular.element(inp).attr('ng-model', path);
                                return inp;
                            },

                            typeDetector = [
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
                            ],

                            getType = function (val) {
                                var i;
                                for (i = 0; i < typeDetector.length; i += 1) {
                                    if (typeDetector[i].checkMethod(val)) {
                                        return typeDetector[i].type;
                                    }
                                }
                            },

                            displayModelActions = {
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
                                'setLabelHeaderClass': function (wrapper) {
                                    var label = domActions.find('.label_wrapper', wrapper)[0];
                                    domActions.addClass('header', label);
                                },
                                'baseCreateElements': function (name, wrapper, doc, path, depth) {
                                    // Create outer skin
                                    var outer = createElementWrapper('div', 'angularpeeker outerSkin');
                                    outer.appendChild(wrapper);

                                    doc.appendChild(outer);
                                    var label = createLabelSpan(name);
                                    wrapper.appendChild(label);
                                    wrapper.pathName = path;
                                    displayModelActions.setIndentClass(wrapper, depth);
                                },
                                'object': function (obj, doc, path, depth) {
                                    var name, wrapper, key;

                                    name = displayModelActions.baseName(path);
                                    if (name === false) {
                                        return;
                                    }
                                    wrapper = createObjDivWrapper();
                                    displayModelActions.baseCreateElements(name, wrapper, doc, path, depth);
                                    displayModelActions.setLabelHeaderClass(wrapper);

                                    for (key in obj) {
                                        if (obj.hasOwnProperty(key) && key !== 'this' && key !== '$parent' && key !== '$root') {
                                            ScopeViewBuilder.prototype.buildScopeView(obj[key], wrapper, path + '.' + key, depth);
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
                                    displayModelActions.setLabelHeaderClass(wrapper);

                                    arr.forEach(function (item, index) {
                                        ScopeViewBuilder.prototype.buildScopeView(item, wrapper, path + '[' + index + ']', depth);
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
                                    displayModelActions.setLabelHeaderClass(wrapper);

                                    var thisWrapper = createElementWrapper('div', 'angularpeeker function_elements this_field');
                                    // Add an input and an invoke button
                                    var inpThisLabel = createLabelSpan('this');
                                    thisWrapper.appendChild(inpThisLabel);
                                    var inpThis = createElementWrapper('input', 'angularpeeker function_elements this_field for_' + name);
                                    thisWrapper.appendChild(inpThis);
                                    wrapper.appendChild(thisWrapper);

                                    var paramsWrapper = createElementWrapper('div', 'angularpeeker function_elements params_field');
                                    var inpParamsLabel = createLabelSpan('parameters');
                                    paramsWrapper.appendChild(inpParamsLabel);
                                    var inpParams = createElementWrapper('input', 'angularpeeker function_elements params_field for_' + name);
                                    paramsWrapper.appendChild(inpParams);
                                    wrapper.appendChild(paramsWrapper);

                                    var invokeButton = createElementWrapper('div', 'button call_function live_gradient_yellow');
                                    invokeButton.innerHTML = 'Call';
                                    angular.element(invokeButton).attr('ng-click', 'invokeMethod(\'' + name + '\')');
                                    wrapper.appendChild(invokeButton);

                                    var viewMethodButton = createElementWrapper('div', 'button view_function live_gradient_yellow');
                                    viewMethodButton.innerHTML = 'View';
                                    angular.element(viewMethodButton).attr('ng-click', 'viewMethod(\'' + name + '\')');
                                    wrapper.appendChild(viewMethodButton);


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
                        var ScopeViewBuilder = function () {
                        };


                        ScopeViewBuilder.prototype.buildScopeView = function (model, doc, path, depth) {
                            // Create doc if it wasn't passed
                            doc = doc || createObjDivWrapper();
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

                        return new ScopeViewBuilder();
                    }
                ];
            }]);
}());
// Source: app/scripts/templateCache.js
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

            var methodViewerHtml = '<div class="angularpeeker method_viewer">' +
                '<div class="method_content"></div> ' +
                '<div class="button" ng-click="remove()">Close</div>' +
                '</div>';
            $templateCache.put('method-viewer.html', methodViewerHtml);
        }
    ]);

}());