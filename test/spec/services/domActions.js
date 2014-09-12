'use strict';

describe('Service: domActions', function () {

    // instantiate service
    var domActions, $compile, doc;

    // load the service's module
    beforeEach(module('angularPeeker'));

    beforeEach(inject(function (_domActions_, _$compile_) {
        domActions = _domActions_;
        $compile = _$compile_;
    }));

    describe('find() method', function () {
        beforeEach(function () {
            // create a dom part
            doc = angular.element('<div><h1 class="header">This is an html</h1><p>1</p><p>2</p></div>')[0];
        });

        it('should return an array', function () {
            var elements = domActions.find('.header', doc);
            expect(elements instanceof Array).toBe(true);
        });

        it('should return an array of length 1 when looking for .header', function () {
            var elements = domActions.find('.header', doc);
            expect(elements.length).toBe(1);
        });

        it('should return an array of length 2 when looking for p', function () {
            var elements = domActions.find('p', doc);
            expect(elements.length).toBe(2);
        });

        it('should return an array of length 0 when looking for table', function () {
            var elements = domActions.find('table', doc);
            expect(elements.length).toBe(0);
        });

        it('should return the body of the html when no element is provided', function () {
            var elements = domActions.find('body');

            expect(elements[0].tagName).toBe('BODY');
        });

        it('should return an array of length 4 when looking for p in array of elements', function () {
            var twoDocs = angular.element([doc, doc]);
            var elements = domActions.find('p', twoDocs);

            expect(elements.length).toBe(4);
        });

    });

    describe('getElementsType() method', function () {
        it('should return \'Array\'', function () {
            var doc = [1, 2, 3];
            expect(domActions.getElementsType(doc)).toBe('Array');
        });

        it('should return \'NodeList\'', function () {
            var doc = document.getElementsByTagName('*');
            expect(domActions.getElementsType(doc)).toBe('NodeList');
        });

        it('should return \'Node\'', function () {
            var doc = document.getElementsByTagName('*')[0];
            expect(domActions.getElementsType(doc)).toBe('Node');
        });

        it('should return \'angular\'', function () {
            var doc = angular.element('<div></div>');
            expect(domActions.getElementsType(doc)).toBe('angular');
        });
    });

    describe('convertElemsToArray object', function () {

        it('should return an array equal to the one sent', function () {
            var arr = [1, 2, 3];
            expect(domActions.convertElemsToArray.Array(arr)).toBe(arr);
        });

        it('should return an array when sending nodeList', function () {
            var elems = document.getElementsByTagName('body');
            expect(domActions.convertElemsToArray.NodeList(elems) instanceof Array).toBe(true);
        });

        it('should return an array of length 1 when sending nodeList of 1', function () {
            var elems = document.getElementsByTagName('body');
            expect(domActions.convertElemsToArray.NodeList(elems).length).toBe(1);
        });

        it('should return an array when sending a node', function () {
            var elem = document.createElement('div');
            expect(domActions.convertElemsToArray.Node(elem) instanceof Array).toBe(true);
        });

        it('should return an array of length 1 when sending one node', function () {
            var elem = document.createElement('div');
            expect(domActions.convertElemsToArray.Node(elem).length).toBe(1);
        });

        it('should return an array when sending angular elements', function () {
            var elems = angular.element([document.createElement('div'), document.createElement('div')]);
            expect(domActions.convertElemsToArray.angular(elems) instanceof Array).toBe(true);
        });

        it('should return an array of length 2 when sending two elements in angular wrapper', function () {
            var elems = angular.element([document.createElement('div'), document.createElement('div')]);
            expect(domActions.convertElemsToArray.angular(elems).length).toBe(2);
        });

        it('should return an array when sending a string', function () {
            var elem = '<div></div>';
            expect(domActions.convertElemsToArray.string(elem) instanceof Array).toBe(true);
        });


    });

    describe('removeClass() method', function () {
        var doc;
        beforeEach(function () {
            var div1 = document.createElement('div');
            div1.className = 'some_class';
            var div2 = document.createElement('div');
            div2.className = 'some_class';
            doc = angular.element([div1, div2]);
        });

        it('the first div in doc should be without class some_class', function () {
            expect(doc[0].className).toBe('some_class');
            expect(doc[1].className).toBe('some_class');
            domActions.removeClass('some_class', doc[0]);
            expect(doc[0].className).toBe('');
            expect(doc[1].className).toBe('some_class');
        });

        it('all divs in doc should be without class some_class', function () {
            expect(doc[0].className).toBe('some_class');
            expect(doc[1].className).toBe('some_class');
            domActions.removeClass('some_class', doc);
            expect(doc[0].className).toBe('');
            expect(doc[1].className).toBe('');
        });
    });

    describe('addClass() method', function () {
        var doc;
        beforeEach(function () {
            var div1 = document.createElement('div');
            div1.className = 'some_class';
            var div2 = document.createElement('div');
            div2.className = 'some_class';
            doc = angular.element([div1, div2]);
        });

        it('the first div in doc should be without class some_class', function () {
            expect(doc[0].className).toBe('some_class');
            expect(doc[1].className).toBe('some_class');
            domActions.addClass('another_class', doc[0]);
            expect(doc[0].className).toBe('some_class another_class');
            expect(doc[1].className).toBe('some_class');
        });

        it('all divs in doc should be without class some_class', function () {
            expect(doc[0].className).toBe('some_class');
            expect(doc[1].className).toBe('some_class');
            domActions.addClass('another_class', doc);
            expect(doc[0].className).toBe('some_class another_class');
            expect(doc[1].className).toBe('some_class another_class');
        });
    });

});
