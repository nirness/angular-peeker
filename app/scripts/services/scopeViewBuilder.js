(function () {
    'use strict';

    /**
     * @ngdoc service
     * @name angularPeeker.scopeViewBuilder
     * @description
     * # scopeViewBuilder
     * Provider in the angularPeeker.
     */
    angular.module('angularPeeker')
        .provider('scopeViewBuilder', function () {

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

                    return new ScopeViewBuilder();
                }
            ];
        });
}());