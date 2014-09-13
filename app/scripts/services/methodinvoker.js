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
                    findRelevantThisInputField: function (methodName) {
                        return domActions.find('input.angularpeeker.function_elements.this_field.for_' + methodName)[0];
                    },
                    findRelevantParamsInputField: function (methodName) {
                        return domActions.find('input.angularpeeker.function_elements.params_field.for_' + methodName)[0];
                    },
                    getTypedParam: function (scope, paramName) {
                        //validate paramName
                        if (!paramName || paramName.length === 0) {
                            return null;
                        }

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

                        // find if its a variable name
                        if (scope[paramName] !== undefined) {
                            return scope[paramName];
                        }

                        return null;
                    },
                    getParams: function (scope, methodName) {
                        var input = factory.findRelevantParamsInputField(methodName),
                            paramsString = input.value,
                            paramNames = paramsString.trim().split(','),
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
                        debugger;
                        var args = factory.getParams(scope, methodName);
                        var that = factory.getThis(scope, methodName);
                        scope[methodName].apply(that, args);
                    }
                };

                return factory;
            }]);
}());