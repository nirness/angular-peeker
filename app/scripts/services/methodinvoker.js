(function () {
    'use strict';

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