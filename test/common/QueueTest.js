var assert = require("assert");

var Queue = require('../../src/common/VictimsStructures/Queue.js');
var Requirement = require('../../src/common/Requirement.js');
var Page = require('../../src/common/Page.js');

/*
| --------------------------------------------------------------------
| Class Queue
| --------------------------------------------------------------------
| Methods:
|   - size(): int
|   - peek(): object
|   - pageOf(element): int
|   - contains(element): boolean
|   - add(element)
|   - addAll(collection)
|   - first(): object
|   - clear()
| --------------------------------------------------------------------
*/

module.exports = function() {

  describe('Queue', function() {

    var q = new Queue();

    // Hook method: reset queue when each describe() has finished.
    beforeEach(function() {
      q = new Queue();
      req1 = new Requirement({ 'process': 'A', 'pageNumber': 1, 'mode' : 'read' });
      req2 = new Requirement({ 'process': 'B', 'pageNumber': 1, 'mode' : 'read' });
      req3 = new Requirement({ 'process': 'C', 'pageNumber': 2, 'mode' : 'read' });
      req4 = new Requirement({ 'process': 'A', 'pageNumber': 1, 'mode' : 'read' });
      req5 = new Requirement({ 'process': 'D', 'pageNumber': 1, 'mode' : 'read' });
      page1 = req1.asPage();
      page2 = req2.asPage();
      page3 = req3.asPage();
      page4 = req4.asPage();
      page5 = req5.asPage();
    });

    // Test method add()
    describe('#add()', function () {
      it('Queue is empty, add one element', function () {
        assert.equal(q, q.add(page1));
      });
      it('Queue is not empty, add other element', function () {
        q.add(page1);
        assert.equal(q, q.add(page2));
      });
    });

    // Test method size()
    describe('#size()', function () {
      it('Queue is empty, should be 0', function () {
        assert.equal(0, q.size());
      });

      it('Queue is not empty, should be != 0', function () {
        q.add(page1);
        assert.notEqual(0, q.size());
        assert.equal(1, q.size());
        q.add(page2);
        assert.notEqual(0, q.size());
        assert.equal(2, q.size());
      });
    });

    // Test method peek()
    describe('#peek()', function () {
      it('Queue is empty, should return undefined', function () {
        assert.equal(undefined, q.peek());
      });

      it('Queue is not empty, should be the first element', function () {
        q.add(page3);
        q.add(page4);
        q.add(page1);
        assert.equal(page3, q.peek());
        assert.notEqual(page2, q.peek());
      });
    });

    // Test method pageOf()
    describe('#pageOf()', function () {
      it('Queue is empty, should return undefined', function () {
        assert.equal(undefined, q.pageOf(page3));
      });

      it('Queue is not empty, item is present, should return != undefined', function () {
        q.add(page3);
        q.add(page1);
        q.add(page2);
        assert.equal(page3, q.pageOf(req3));
        assert.equal(page1, q.pageOf(req1));
        assert.equal(page2, q.pageOf(req2));
      });

      it('Queue is not empty, item is not present, should return undefined', function () {
        q.add(page3);
        q.add(page1);
        q.add(page2);
        assert.equal(undefined, q.pageOf(req5));
      });
    });

    // Test method contains()
    describe('#contains()', function () {
      it('Queue is empty, should return false', function () {
        assert.equal(false, q.contains(page3));
      });

      it('Queue is not empty, item is present, should return true', function () {
        q.add(page3);
        q.add(page1);
        q.add(page2);
        assert.equal(true, q.contains(page3));
        assert.equal(true, q.contains(page1));
        assert.equal(true, q.contains(page2));
      });

      it('Queue is not empty, item is not present, should return false', function () {
        q.add(page3);
        q.add(page1);
        q.add(page2);
        assert.equal(false, q.contains(page5));
      });
    });

    // Test method addAll()
    describe('#addAll()', function () {
      it('Queue should be empty after adding an empty collection', function () {
        q.addAll([]);
        assert.equal(0, q.size());
      });

      it('Queue should add all the elements', function () {
        q.addAll([page1,page2,page3,page5]);
        assert.equal(4, q.size());
        assert.equal(true, q.contains(page1));
        assert.equal(true, q.contains(page2));
        assert.equal(true, q.contains(page3));
        assert.equal(true, q.contains(page5));
      });
    });

    // Test method first()
    describe('#first()', function () {
      it('Queue is empty, should return undefined', function () {
        assert.equal(undefined, q.first());
      });

      it('Queue is not empty, should return first element', function () {
        q.addAll([page3,page1,page2]);
        assert.equal(page3, q.first());
        assert.equal(page1, q.first());
        assert.equal(page2, q.first());
        assert.equal(undefined, q.first());
      });
    });

    // Test method remove()
    describe('#remove()', function () {
      it('Queue is empty, should return undefined', function () {
        assert.equal(undefined, q.remove(req1));
      });

      it('Queue is not empty, should return an element', function () {
        q.addAll([page3,page1,page2]);
        assert.equal(page3, q.remove(req3));
        assert.equal(page2, q.remove(req2));
        assert.equal(page1, q.remove(req1));
        assert.equal(undefined, q.remove(req5));
        assert.equal(undefined, q.remove(req1));
      });
    });

    // Test method clone()
    describe('#clone()', function () {
      it('Queue is empty, your clone should be equal to a new queue', function () {
        q2 = new Queue();
        assert.deepEqual(q, q2);
        assert.deepEqual(q.clone(), q2);
      });

      it('Queue is not empty, your clone should be equal in content, not in referenced', function () {
        q.add(page2);
        q.add(page5);
        q2 = q.clone();
        assert.equal(true, q.pageOf(page2).equals(q2.pageOf(page2)));
        assert.equal(true, q.pageOf(page5).equals(q2.pageOf(page5)));
      });
    });

    // Test method clear()
    describe('#clear()', function () {
      it('Queue is empty, should stay empty', function () {
        q.clear();
        assert.equal(0, q.size());
      });

      it('Queue is not empty, should be empty', function () {
        q.addAll([page3,page2,page3,page4,page5,page1]);
        q.clear();
        assert.equal(0, q.size());
      });
    });
  });
}
