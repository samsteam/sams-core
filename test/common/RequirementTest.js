var assert = require("assert");

var Requirement = require('../../src/common/Requirement.js');
var Page = require('../../src/common/Page.js');

/*
| --------------------------------------------------------------------
| Class Requirement
| --------------------------------------------------------------------
| Methods:
|
|   - validate(): boolean
|   - equals(object): boolean
|   - asDataObject(): object
|   - asPage(): object
|   - clone(): object
|   - toString(): string
|
| --------------------------------------------------------------------
*/

module.exports = function() {

  describe('Requirement', function() {

    var rq1;
    var rq2;
    var rq3;
    var rq4;
    var rq5;

    // Hook method: reset queue before each describe()
    beforeEach(function() {

      var obj1 = { 'process': 'A', 'pageNumber': 1, 'mode' : 'read' };
      rq1 = new Requirement(obj1);

      var obj2 = { 'process': 'A', 'pageNumber': 1, 'mode' : 'read' };
      rq2 = new Requirement(obj2);

      var obj3 = { 'process': 'B', 'pageNumber': 1, 'mode' : 'read' };
      rq3 = new Requirement(obj3);

      var obj4 = { 'process': 'B', 'pageNumber': 2, 'mode' : 'write' };
      rq4 = new Requirement(obj4);

      var obj5 = { 'process': '', 'pageNumber': '2', 'mode' : 'caca' };
      rq5 = new Requirement(obj5);


    });


    // Test method validate():boolean
    describe('#validate()', function () {

      it('Requirement has erroneous data, should return false', function () {

        assert.equal(false,rq5.validate());

      });

      it('Requirement has correct data, should return true', function () {

        assert.equal(true, rq1.validate());
        assert.equal(true, rq2.validate());
        assert.equal(true, rq3.validate());
        assert.equal(true, rq4.validate());
      });

    });


    // Test method equals(object):boolean
    describe('#equals(object)', function () {

      it('Comparing a request with itself, should return true', function () {

        assert.equal(true, rq1.equals(rq1));

      });

      it('Comparing 2 requests who has the same internal state, should return true', function () {

        assert.equal(true, rq1.equals(rq2));

      });

      it('Comparing 2 different requests, should return false', function () {

        assert.equal(false, rq1.equals(rq3));
        assert.equal(false, rq3.equals(rq4));

      });

    });


    // Test method asDataObject():object
    describe('#asDataObject()', function () {

      it('Data object should retain the same data that the request', function () {

        var dataObject = rq1.asDataObject();
        assert.equal(dataObject.pageNumber, rq1.getPageNumber());
        assert.equal(dataObject.process, rq1.getProcess());
//        assert.equal(dataObject.mode, rq1.getMode());

      });

    });


    // Test method asPage():object
    describe('#asPage()', function () {

      it('Resultant object should be a Page', function () {

        var page = rq1.asPage();
        assert.equal(true, page instanceof Page);

      });

      it('Resultant Page should retain the same data as the Requirement', function () {

        var page = rq1.asPage();

        assert.equal(rq1.getMode(), page.getMode());
        assert.equal(rq1.getProcess(), page.getProcess());
        assert.equal(rq1.getPageNumber(), page.getPageNumber());

      });

    });


    // Test method clone():object
    describe('#clone()', function () {

      it('Resultant object should be a Requirement', function () {

        var page = rq1.clone();
        assert.equal(true, page instanceof Requirement);

      });

      it('Resultant Requirement should retain the same data as the original', function () {

        var rq1clone = rq1.clone();

        assert.equal(rq1.getMode(), rq1clone.getMode());
        assert.equal(rq1.getProcess(), rq1clone.getProcess());
        assert.equal(rq1.getPageNumber(), rq1clone.getPageNumber());

      });

      it('Resultant Requirement should not be identic', function () {

        var rq1clone = rq1.clone();

        assert.equal(rq1.getMode(), rq1clone.getMode());
        assert.equal(rq1.getProcess(), rq1clone.getProcess());
        assert.equal(rq1.getPageNumber(), rq1clone.getPageNumber());
        assert.notEqual(true, rq1 === rq1clone);

      });

    });


    // Test method toString():string
    describe('#toString()', function () {

      it('Should return a string', function () {

        assert.equal(true, typeof rq1.toString() == 'string');

      });

    });

  });
}
