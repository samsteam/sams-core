var assert = require("assert");

var Behavior = require('../../src/common/Behavior.js');

/*
| --------------------------------------------------------------------
| Class Behavior
| --------------------------------------------------------------------
| Methods:
|   - ComparingMethod(): boolean
|   - CloningMethod(): object
| --------------------------------------------------------------------
*/

module.exports = function() {

  describe('Behavior', function() {

    // "b" has the same internal state that "a", but a !== b
    // "a1" and "a" are same object (a === a1)
    var a, a1, b, c;

    // Hook method: Run before execute all tests
    before(function(){
      a = {a: 1, b: 2};
      a1 = a;
      b = {a: 1, b: 2};
      c = {a: 1, b: 5};
    });

    // Test method ComparingMethod()
    describe('#ComparingMethod()', function () {
      it('Comparing equals objects (===), should return true', function () {
        assert.equal(true, Behavior.ComparingMethod(a)(a,a));
        assert.equal(true, Behavior.ComparingMethod(a)(a,a1));
        assert.equal(true, Behavior.ComparingMethod(a1)(a1,a));
      });

      it('Comparing not equals objects (!==), should return false', function () {
        assert.equal(false, Behavior.ComparingMethod(a,b)(a,b));
        assert.equal(false, Behavior.ComparingMethod(b,a)(b,a));
      });
    });

    // Test method CloningMethod()
    describe('#CloningMethod()', function () {
      it('Cloning object, should have same values that other object', function () {
        assert.deepEqual(b, Behavior.CloningMethod(a)(a));
      });
      it('Cloning object, should not have same values that other object', function () {
        assert.notDeepEqual(c, Behavior.CloningMethod(b)(b));
      });
    });
  });
}
