var assert = require("assert");

var Queue = require('../src/common/Queue.js');

/*
| --------------------------------------------------------------------
| Class Queue
| --------------------------------------------------------------------
| Methods:
|   - size(): int
|   - peek(): object
|   - indexOf(element): int
|   - contains(element): boolean
|   - enqueue(element)
|   - addAll(collection)
|   - dequeue(): object
|   - clear()
| --------------------------------------------------------------------
*/

module.exports = function() {

  describe('Queue', function() {

    var q = new Queue();

    // Hook method: reset queue when each describe() has finished.
    afterEach(function() {
      q = new Queue();
    });

    // Test method enqueue()
    describe('#enqueue()', function () {
      it('Queue is empty, add one element', function () {
        q.enqueue(3);
      });
      it('Queue is not empty, add other element', function () {
        q.enqueue(5);
      });
    });

    // Test method size()
    describe('#size()', function () {
      it('Queue is empty, should be 0', function () {
        assert.equal(0, q.size());
      });

      it('Queue is not empty, should be != 0', function () {
        q.enqueue(5);
        assert.notEqual(0, q.size());
      });
    });

    // Test method peek()
    describe('#peek()', function () {
      it('Queue is empty, should return undefined', function () {
        assert.equal(undefined, q.peek());
      });

      it('Queue is not empty, should be the first element', function () {
        q.enqueue(3);
        q.enqueue(1);
        q.enqueue(2);
        assert.equal(3, q.peek());
        assert.notEqual(1, q.peek());
      });
    });

    // Test method indexOf()
    describe('#indexOf()', function () {
      it('Queue is empty, should return -1', function () {
        assert.equal(-1, q.indexOf(3));
      });

      it('Queue is not empty, item is present, should return != -1', function () {
        q.enqueue(3);
        q.enqueue(1);
        q.enqueue(2);
        assert.equal(0, q.indexOf(3));
        assert.equal(1, q.indexOf(1));
        assert.equal(2, q.indexOf(2));
      });

      it('Queue is not empty, item is not present, should return -1', function () {
        q.enqueue(3);
        q.enqueue(1);
        q.enqueue(2);
        assert.equal(-1, q.indexOf(4));
      });
    });

    // Test method contains()
    describe('#contains()', function () {
      it('Queue is empty, should return false', function () {
        assert.equal(false, q.contains(3));
      });

      it('Queue is not empty, item is present, should return true', function () {
        q.enqueue(3);
        q.enqueue(1);
        q.enqueue(2);
        assert.equal(true, q.contains(3));
        assert.equal(true, q.contains(1));
        assert.equal(true, q.contains(2));
      });

      it('Queue is not empty, item is not present, should return false', function () {
        q.enqueue(3);
        q.enqueue(1);
        q.enqueue(2);
        assert.equal(false, q.contains(5));
      });
    });

    // Test method addAll()
    describe('#addAll()', function () {
      it('Queue should be empty after adding an empty collection', function () {
        q.addAll([]);
        assert.equal(0, q.size());
      });

      it('Queue should add all the elements', function () {
        q.addAll([1,2,3,4,5]);
        assert.equal(5, q.size());
        assert.equal(true, q.contains(1));
        assert.equal(true, q.contains(2));
        assert.equal(true, q.contains(3));
        assert.equal(true, q.contains(4));
        assert.equal(true, q.contains(5));
      });
    });

    // Test method dequeue()
    describe('#dequeue()', function () {
      it('Queue is empty, should return undefined', function () {
        assert.equal(undefined, q.dequeue());
      });

      it('Queue is not empty, should return first element', function () {
        q.addAll([3,1,2]);
        assert.equal(3, q.dequeue());
        assert.equal(1, q.dequeue());
        assert.equal(2, q.dequeue());
        assert.equal(undefined, q.dequeue());
      });
    });

    // Test method clear()
    describe('#clear()', function () {
      it('Queue is empty, should stay empty', function () {
        q.clear();
        assert.equal(0, q.size());
      });

      it('Queue is not empty, should be empty', function () {
        q.addAll([3,2,3,4,5,6]);
        q.clear();
        assert.equal(0, q.size());
      });
    });
  });
}
