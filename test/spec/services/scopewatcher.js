'use strict';

describe('Service: scopeWatcher', function () {

    // load the service's module
    beforeEach(module('angularPeekerApp'));

    // instantiate service
    var scopeWatcher;
    beforeEach(inject(function (_scopeWatcher_) {
        scopeWatcher = _scopeWatcher_;
    }));

    it('should do something', function () {
        expect(!!scopeWatcher).toBe(true);
    });

});
