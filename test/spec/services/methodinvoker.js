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
            //put a spy on the scope
            spyOn(scope, 'someMethod');
        });
        it('should call someMethod on the scope', function () {
            methodInvoker.invoke(scope, 'someMethod');
            expect(scope.someMethod).toHaveBeenCalled();
        });


    });
}());
