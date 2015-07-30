var assert = require("assert");

var Requirement = require('../../src/common/Requirement.js');
var Page = require('../../src/common/Page.js');

/*
| --------------------------------------------------------------------
| Class Page
| --------------------------------------------------------------------
| Methods:
|
|   - asDataObject(): object
|   - clone(): object
|   - clearPageFault()
|   - clearReferenced()
|   - asPage(): object
|   - validate(): boolean
|   - equals(object): boolean
|   - toString(): string
|
| --------------------------------------------------------------------
*/

module.exports = function() {

  describe('Page', function() {

    var page1;
    var page2;
    var page3;
    var page4;
    var page5;

    // Hook method: reset queue before each describe()
    beforeEach(function() {

      var obj1 = { 'process': 'A', 'pageNumber': 1, 'mode' : 'read' };
      page1 = new Requirement(obj1).asPage();

      var obj2 = { 'process': 'A', 'pageNumber': 1, 'mode' : 'read' };
      page2 = new Requirement(obj2).asPage();

      var obj3 = { 'process': 'B', 'pageNumber': 1, 'mode' : 'read' };
      page3 = new Requirement(obj3).asPage();

      var obj4 = { 'process': 'B', 'pageNumber': 2, 'mode' : 'write' };
      page4 = new Requirement(obj4).asPage();

      var obj5 = { 'process': '', 'pageNumber': '2', 'mode' : 'caca' };
      page5 = new Requirement(obj5).asPage();


    });

    // Test method asDataObject():object
    describe('#asDataObject()', function () {

      it('Data object should retain the same information as the Page', function () {

        dataObj = page1.asDataObject();

        assert.equal(dataObj.process, page1.getProcess());
        assert.equal(dataObj.pageNumber, page1.getPageNumber());
        assert.equal(dataObj.mode, page1.getMode());
        assert.equal(dataObj.referenced, page1.isReferenced());
        assert.equal(dataObj.pageFault, page1.isPageFault());

      });


    });


    // Test method clone():page
    describe('#clone()', function () {

      it('Resultant object should be a Page', function () {

        var page = page1.clone();
        assert.equal(true, page instanceof Page);

      });

      it('Resultant Page should retain the same data as the original', function () {

        var p2clone = page2.clone();

        assert.equal(page2.getMode(), p2clone.getMode());
        assert.equal(page2.getProcess(), p2clone.getProcess());
        assert.equal(page2.getPageNumber(), p2clone.getPageNumber());
        assert.equal(page2.isReferenced(), p2clone.isReferenced());
        assert.equal(page2.isPageFault(), p2clone.isPageFault());


      });

      it('Resultant Requirement should not be identic', function () {

        var p2clone = page2.clone();

        assert.equal(page2.getMode(), p2clone.getMode());
        assert.equal(page2.getProcess(), p2clone.getProcess());
        assert.equal(page2.getPageNumber(), p2clone.getPageNumber());
        assert.equal(page2.isReferenced(), p2clone.isReferenced());
        assert.equal(page2.isPageFault(), p2clone.isPageFault());

        assert.notEqual(true, page2 === p2clone);

      });

    });


    // Test method clearPageFault()
    describe('#clearPageFault()', function () {

      it('Page is in Page Fault, should no longer be on it', function () {

        assert.equal(true, page3.isPageFault());

        page3.clearPageFault();
        assert.equal(false, page3.isPageFault());

      });

      it('Page isn\'t in Page Fault, should stay as it is', function () {

        page3.setPageFault(false);
        assert.equal(false, page3.isPageFault());

        page3.clearPageFault();
        assert.equal(false, page3.isPageFault());

      });

    });


    // Test method clearReferenced()
    describe('#clearReferenced()', function () {

      it('Page is referenced, should no longer be in that state', function () {

        assert.equal(true, page3.isReferenced());

        page3.clearReferenced();
        assert.equal(false, page3.isReferenced());

      });

      it('Page isn\'t referenced, should stay that way', function () {

        page3.setReferenced(false);
        assert.equal(false, page3.isReferenced());

        page3.clearReferenced();
        assert.equal(false, page3.isReferenced());

      });

    });

    // Test method asPage(): page
    describe('#asPage()', function () {

      it('Resultant object should be a Page', function () {

        obj = page4.asPage();
        assert.equal(true, obj instanceof Page);

      });

      it('Resultant Page should retain the original data', function () {

        pageCopy = page4.asPage();

        assert.equal(page4.getMode(), pageCopy.getMode());
        assert.equal(page4.getProcess(), pageCopy.getProcess());
        assert.equal(page4.getPageNumber(), pageCopy.getPageNumber());
        assert.equal(page4.isReferenced(), pageCopy.isReferenced());
        assert.equal(page4.isPageFault(), pageCopy.isPageFault());

      });

      it('Resultant Page shouldn\'t hold the same reference as the original', function () {

        pageCopy = page4.asPage();

        assert.equal(page4.getMode(), pageCopy.getMode());
        assert.equal(page4.getProcess(), pageCopy.getProcess());
        assert.equal(page4.getPageNumber(), pageCopy.getPageNumber());
        assert.equal(page4.isReferenced(), pageCopy.isReferenced());
        assert.equal(page4.isPageFault(), pageCopy.isPageFault());

      });

    });

    // Test method validate():boolean
    describe('#validate()', function () {

      it('Page has erroneous data, should return false', function () {

        assert.equal(false,page5.validate());

      });

      it('Page has correct data, should return true', function () {

        assert.equal(true, page1.validate());
        assert.equal(true, page2.validate());
        assert.equal(true, page3.validate());
        assert.equal(true, page4.validate());
      });

    });


    // Test method equals(object):boolean
    describe('#equals(object)', function () {

      it('Comparing a page with itself, should return true', function () {

        assert.equal(true, page1.equals(page1));

      });

      it('Comparing 2 pages who has the same internal state, should return true', function () {

        assert.equal(true, page1.equals(page2));

      });

      it('Comparing 2 different pages, should return false', function () {

        assert.equal(false, page1.equals(page3));
        assert.equal(false, page3.equals(page4));

      });

    });

  });
}
