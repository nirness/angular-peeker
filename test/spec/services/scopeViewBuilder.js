'use strict';

describe('Service: scopeViewBuilder', function () {

    // load the service's module
    beforeEach(module('angularPeeker'));

    // instantiate service
    var scopeViewBuilder;
    beforeEach(inject(function (_scopeViewBuilder_) {
        scopeViewBuilder = _scopeViewBuilder_;
    }));

    it('should do something', function () {
        expect(!!scopeViewBuilder).toBe(true);
    });

});
