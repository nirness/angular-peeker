(function () {
    'use strict';

    describe('Service: methodInvoker', function () {

        // load the service's module
        beforeEach(module('angularPeeker'));

        // instantiate service
        var methodInvoker, $rootScope, scope;
        beforeEach(inject(function (_methodInvoker_, _$rootScope_) {
            methodInvoker = _methodInvoker_;
            $rootScope = _$rootScope_;
        }));

        beforeEach(function () {
            // Create a new scope
            scope = $rootScope.$new();

            //put a function on the scope
            scope.someMethod = function () {
                return 'worked';
            };

            // Put some param on the scope
            scope.someParam = 'I am some param';

            //put a spy on the scope
            spyOn(scope, 'someMethod');
        });

        describe('test split', function () {

            it('should return 4 members when called with ignoreInJson=false using [1,2,3,4] as string',
                function () {
                    var arr = methodInvoker.split('[1,2,3,4]', ',', false);
                    expect(arr.length).toBe(4);
                });

            it('should return one member when called with [1,2,3,4]', function () {
                var arr = methodInvoker.split('[1,2,3,4]');
                expect(arr.length).toBe(1);
            });

            it('should return one member that equals [1,2,3,4] when called with [1,2,3,4]', function () {
                var arr = methodInvoker.split('[1,2,3,4]');
                expect(arr[0]).toBe('[1,2,3,4]');
            });

            it('should return three member when called with [1,2,3,4], "tree", {a:1,b:2}', function () {
                var arr = methodInvoker.split('[1,2,3,4], "tree", {a:1,b:2}');
                expect(arr.length).toBe(3);
            });

            it('should equal [1,2,3,4] and "tree" and {a:1,b:2} when called with [1,2,3,4], "tree", {a:1,b:2}', function () {
                var arr = methodInvoker.split('[1,2,3,4], "tree", {a:1,b:2}');
                expect(arr[0]).toBe('[1,2,3,4]');
                expect(arr[1]).toBe('"tree"');
                expect(arr[2]).toBe('{a:1,b:2}');
            });

        });

        describe('test getTypedParam', function () {
            it('should return null when invoked with undefined, null or empty string',
                function () {
                    expect(methodInvoker.getTypedParam(scope, undefined)).toBe(null);
                    expect(methodInvoker.getTypedParam(scope, null)).toBe(null);
                    expect(methodInvoker.getTypedParam(scope, '')).toBe(null);
                });

            it('should return a number when invoked with a number string',
                function () {
                    expect(typeof methodInvoker.getTypedParam(scope, '123')).toBe('number');
                    expect(methodInvoker.getTypedParam(scope, '123')).toBe(123);
                });

            it('should return a string when invoked with \'\' or ""',
                function () {
                    expect(typeof methodInvoker.getTypedParam(scope, '\'hello\'')).toBe('string');
                    expect(methodInvoker.getTypedParam(scope, '\'hello\'')).toBe('hello');
                });

            it('should return an array when invoked with []',
                function () {
                    var arrString = '[0, 1, 2, 3]';
                    expect(methodInvoker.getTypedParam(scope, arrString) instanceof Array).toBe(true);
                    var equals = true;
                    var retArr = methodInvoker.getTypedParam(scope, arrString);
                    for (var i = 0; i < retArr.length; i += 1) {
                        if (retArr[i] !== i) {
                            equals = false;
                        }
                    }
                    if (retArr.length !== 4) {
                        equals = false;
                    }
                    expect(equals).toBe(true);
                });

            it('should return an object when invoked with {}',
                function () {
                    var objString = '{a: 1, b:\'2\'}';
                    expect(methodInvoker.getTypedParam(scope, objString).toString()).toBe('[object Object]');
                    var equals = true;
                    var obj = methodInvoker.getTypedParam(scope, objString);
                    expect(obj.hasOwnProperty('a')).toBe(true);
                    expect(obj.a).toBe(1);
                    expect(obj.hasOwnProperty('b')).toBe(true);
                    expect(obj.b).toBe('2');
                });
        });

        describe('invoke without parameters', function () {
            beforeEach(function () {
                methodInvoker.getParams = function () {
                    return [];
                };
                methodInvoker.getThis = function () {
                    return this;
                };
            });

            it('should call someMethod on the scope', function () {
                methodInvoker.invoke(scope, 'someMethod');
                expect(scope.someMethod).toHaveBeenCalled();
            });
        });

        describe('invoke with parameters', function () {
            beforeEach(function () {
                // put a parameter on the scope
                scope.someParam = 'I am a param';
                methodInvoker.findRelevantThisInputField = function () {
                    var inp = document.createElement('input');
                    inp.value = scope;
                };
                methodInvoker.findRelevantParamsInputField = function () {
                    var inp = document.createElement('input');
                    inp.value = '12, \'123\', "1234", someParam, someParam2';
                };
            });

        });


    });
}());
