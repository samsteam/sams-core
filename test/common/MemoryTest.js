var assert = require("assert");

var Memory = require('../../src/common/Memory.js');
var Page = require('../../src/common/Page.js');
var Requirement = require('../../src/common/Requirement.js');

/*
| --------------------------------------------------------------------
| Class Memory
| --------------------------------------------------------------------
| Methods:
|
|   - isFull(): boolean
|   - getFreeFrame(): int
|   - getFrameOf(object): int
|   - contains(object): boolean
|   - at(int): object
|   - atPut(int, object): boolean
|   - equals(object): boolean
|   - clone(): object
|   - forEach(function, object)
|
| --------------------------------------------------------------------
*/

module.exports = function() {

  describe('Memory', function() {

    var obj1, obj2, obj3, obj4;
    var page1, page2, page3, page4;

    var memoryWithoutCapacity, memory;

    before(function(){
      obj1 = { 'process': 'A', 'pageNumber': 1, 'mode' : 'read' };
      obj2 = { 'process': 'B', 'pageNumber': 1, 'mode' : 'read' };
      obj3 = { 'process': 'C', 'pageNumber': 2, 'mode' : 'read' };
      obj4 = { 'process': 'A', 'pageNumber': 1, 'mode' : 'read' };
      req1 = new Requirement(obj1);
      req2 = new Requirement(obj2);
      req3 = new Requirement(obj3);
      req4 = new Requirement(obj4);
      page1 = new Requirement(obj1).asPage();
      page2 = new Requirement(obj2).asPage();
      page3 = new Requirement(obj3).asPage();
      page4 = new Requirement(obj4).asPage();
    });


    // Hook method: reset queue before each describe()
    beforeEach(function() {
      memory = new Memory(6);
      memoryWithoutCapacity = new Memory(0);
    });

    // Test method isFull():boolean
    describe('#isFull()', function () {
      it('Una memoria sin capacidad, debería devolver true', function () {
        assert.equal(true, memoryWithoutCapacity.isFull());
      });

      it('Una memoria con capacidad pero vacía, devuelve false', function () {
        assert.equal(false, memory.isFull());
      });


      it('Una memoria con elementos pero no llena, devuelve false', function () {
        memory = new Memory(3);
        memory.atPut(0, page3);
        memory.atPut(1, page1);
        assert.equal(false, memory.isFull());
      });

      it('Una memoria llena, devuelve true', function () {
        memory = new Memory(3);
        memory.atPut(0, page3);
        memory.atPut(1, page1);
        memory.atPut(2, page2);
        assert.equal(true, memory.isFull());
      });

    });

    // Test method getFreeFrame():int
    describe('#getFreeFrame()', function () {
      it('Una memoria vacía no tiene Frames libres', function () {
        assert.equal(-1, memoryWithoutCapacity.getFreeFrame());
      });

      it('Una memoria sin páginas debería devolver la posicion 0', function () {
        assert.equal(0, memory.getFreeFrame());
      });

      it('Una memoria con páginas debería devolver la primera posicion libre', function () {
        memory.atPut(0, page3);
        assert.equal(1, memory.getFreeFrame());

        memory.atPut(2, page1);
        assert.equal(1, memory.getFreeFrame());

        memory.atPut(1, page2);
        assert.equal(3, memory.getFreeFrame());
      });
    });

    // Recibe un Requierement o Page
    // Test method getFreeFrameOf(object):int
    describe('#getFrameOf(object)', function () {
      it('Un requerimiento que no se encuentra, devuelve -1', function () {
        memory.atPut(0, page3);
        assert.equal(-1, memory.getFrameOf(page1));
      });

      it('Un requerimiento que si se encuentra', function () {
        memory.atPut(0, page3);
        memory.atPut(2, page4);
        assert.equal(0, memory.getFrameOf(page3));
        assert.equal(0, memory.getFrameOf(req3));
        assert.equal(2, memory.getFrameOf(page4));
        assert.equal(2, memory.getFrameOf(req4));
      });

      it('Recibe un undefined, devuelve -1', function () {
        assert.equal(-1, memory.getFrameOf(undefined));
        assert.equal(-1, memory.getFrameOf({}));
        assert.equal(-1, memory.getFrameOf(null));
      });

    });

    // Preguntar por páginas, no requerimientos
    // Test method contains(object):boolean
    describe('#contains(object)', function () {
      it('Un página que no se encuentra, devuelve false', function () {
        memory.atPut(0, page3);
        assert.equal(false, memory.contains(page1));
      });

      it('Una página que si se encuentra', function () {
        memory.atPut(0, page3);
        memory.atPut(2, page4);
        assert.equal(true, memory.contains(page3));
        assert.equal(true, memory.contains(req3));
        assert.equal(true, memory.contains(page4));
        assert.equal(true, memory.contains(req4));
      });

      it('Recibe un undefined, devuelve false', function () {
        assert.equal(false, memory.contains(undefined));
        assert.equal(false, memory.contains({}));
        assert.equal(false, memory.contains(null));
      });

    });

    // Test method at(int):object
    describe('#at(int)', function () {
      it('Una posición no válida, devuelve undefined', function () {
        assert.equal(undefined, memory.at(-1));
        assert.equal(undefined, memory.at(7));
        assert.equal(undefined, memoryWithoutCapacity.at(0));
        assert.equal(undefined, memoryWithoutCapacity.at(2));
      });

      it('Una posición válida, frames vacío', function () {
        assert.equal(undefined, memory.at(0));
        assert.equal(undefined, memory.at(6));
      });

      it('Una posición válida, con pages', function () {
        memory.atPut(1, page1);
        assert.equal(page1, memory.at(1));
        assert.notEqual(page2, memory.at(1));
        assert.notEqual(page4, memory.at(1));
      });
    });

    // Test method atPut(int, object):boolean
    describe('#atPut(int, object)', function () {
      it('Una posición no válida, devuelve false', function () {
        assert.equal(false, memory.atPut(-1, page1));
        assert.equal(false, memory.atPut(6, page2));
        assert.equal(false, memory.atPut(7, page3));
        assert.equal(false, memoryWithoutCapacity.atPut(1, page4));
      });

      it('Con una pocisión válida', function () {

        assert.equal(true, memory.atPut(1, page1));
        assert.equal(page1, memory.at(1));

        assert.equal(true, memory.atPut(1, page2));
        assert.equal(page2, memory.at(1));

        assert.equal(true, memory.atPut(2, page3));
        assert.equal(page3, memory.at(2));
        assert.notEqual(page2, memory.at(2));
      });

      it('Posición válida pero sin objeto', function () {
        assert.equal(false, memory.atPut(1, null));
        assert.equal(false, memory.atPut(1, undefined));
        assert.equal(false, memory.atPut(1, {}));
      });

    });

    // Test method equals(object):boolean
    describe('#equals(object)', function () {
      it('Una memoria debe ser distinta a undefined', function () {
        memory.atPut(1, page1);
        assert.equal(false, memory.equals(undefined));
      });

      it('Dos memorias con misma referencia, devuelve true', function () {
        memory.atPut(1, page1);
        memory3 = memory;
        assert.equal(true, memory.equals(memory3));
      });

      it('Dos memorias distintas con mismo contenido, devuelve true', function () {
        memory.atPut(1, page1);
        memory2 = new Memory(6);
        memory2.atPut(1, page1);
        assert.equal(true, memory.equals(memory2));
      });

      it('Dos memorias distintas con distinto contenido, devuelve false', function () {
        memory.atPut(1, page1);
        memory4 = new Memory(6);
        memory4.atPut(2, page1);
        assert.equal(false, memory.equals(memory4));
      });

    });

    // Test method clone():object
    describe('#clone()', function () {
      it('Una memoria clonada es igual a la original, en contenido', function () {
        assert.deepEqual(memory, memory.clone());
        assert.deepEqual( (new Memory(6)), memory.clone());
      });

      it('Una memoria clonada debe tener una referencia distinta a la original', function () {
        assert.notEqual(memory, memory.clone());
      });
    });

    // Test method forEach(function, object)
    describe('#forEach(function, object)', function () {
      it('Test forEach with invalid params, should return an Error (Exception)', function () {
        memory.atPut(0, page1);
        memory.atPut(1, page4);
        assert.throws(function(){memory.forEach(undefined, this)}, Error);
        assert.throws(function(){memory.forEach(undefined, undefined)}, Error);
      });

      it('Test forEach with valid params', function () {
        memory.atPut(0, page1);
        memory.atPut(1, page4);
        var fnTest = function(exec, ctx){
          return memory.forEach(exec, ctx);
        }
        assert.equal(undefined, fnTest(function(element, index){}, this));
        assert.equal(undefined, fnTest(function(element, index){}, null));
        assert.equal(undefined, fnTest(function(element, index){}, undefined));
      });
    });

  });
}
