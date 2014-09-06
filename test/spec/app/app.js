'use strict';

describe('app:', function () {

    var rootScope, body, config, evt;

    // load the service's module
    beforeEach(module('angularPeeker'));

    beforeEach(function () {
        inject(function (_$rootScope_, _config_) {
            rootScope = _$rootScope_;

            config = _config_;
            body = document.getElementsByTagName('body')[0];
        });
    });


    describe('app: keydown:', function () {

    });


});
