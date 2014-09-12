(function () {
    'use strict';

    describe('Directive: methodViewer', function () {

        // load the directive's module
        beforeEach(module('angularPeeker'));

        var element,
            scope;

        beforeEach(inject(function ($rootScope) {
            scope = $rootScope.$new();
        }));

        xit('should make hidden element visible', inject(function ($compile) {
            element = angular.element('<method-viewer></method-viewer>');
            element = $compile(element)(scope);
            expect(element.text()).toBe('this is the methodViewer directive');
        }));
    });
}());