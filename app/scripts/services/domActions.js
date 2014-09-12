(function () {
    'use strict';

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
                body = document.getElementsByTagName('body')[0];


            var factory = {

                /**
                 *
                 * @param elems
                 * @returns {string}
                 */
                getElementsType: function (elems) {
                    if (elems instanceof Array) {
                        return 'Array';
                    } else if (elems instanceof NodeList || elems instanceof HTMLCollection) {
                        return 'NodeList';
                    } else if (elems instanceof Node) {
                        return 'Node';
                    } else if (elems.scope && elems.injector && elems.length !== undefined) {
                        return 'angular';
                    } else if (typeof elems === 'string') {
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
                    var elementsArr = [];

                    var arr = factory.convertElemsToArray.convert(element);

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
        }
    );

}());