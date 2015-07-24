var assert = require("assert");

var Requirement = require('../../src/common/Requirement.js');

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


    // // Test method equals(object):boolean
    // describe('#equals(object)', function () {
    //
    //   it('', function () {
    //
    //   });
    //
    //   it('', function () {
    //
    //   });
    //
    // });
    //
    //
    // // Test method asDataObject():object
    // describe('#asDataObject()', function () {
    //
    //   it('', function () {
    //
    //   });
    //
    //   it('', function () {
    //
    //   });
    //
    // });
    //
    //
    // // Test method asPage():object
    // describe('#asPage()', function () {
    //
    //   it('', function () {
    //
    //   });
    //
    //   it('', function () {
    //
    //   });
    //
    // });
    //
    //
    // // Test method clone():object
    // describe('#clone()', function () {
    //
    //   it('', function () {
    //
    //   });
    //
    //   it('', function () {
    //
    //   });
    //
    // });
    //
    //
    // // Test method toString():string
    // describe('#toString()', function () {
    //
    //   it('', function () {
    //
    //   });
    //
    //   it('', function () {
    //
    //   });
    //
    // });

  });
}
