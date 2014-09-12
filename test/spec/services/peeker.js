'use strict';

describe('Service: peeker', function () {

    // load the service's module
    beforeEach(module('angularPeeker'));

    // instantiate service
    var peeker;
    beforeEach(inject(function (_peeker_) {
        peeker = _peeker_;
    }));

    it('should do something', function () {
        expect(!!peeker).toBe(true);
    });

});
