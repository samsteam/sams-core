var assert = require("assert");

var Behavior = require('../../src/algorithms/Lru.js');

var Page = require('../../src/common/Page.js');
var Requirement = require('../../src/common/Requirement.js');
var Scheduler  = require('../../src/Scheduler');

/*
| --------------------------------------------------------------------
| Class Lru
| --------------------------------------------------------------------
|
|   -
|
| --------------------------------------------------------------------
*/

module.exports = function() {

  describe('LRU', function() {

    var alg;
    var req1, req, req, req;
    var page1, page2, page3, page4;
    var reqs;
    var sams;
    var instants;
    var comparingInstant;
    var pageDA = new Requirement({ 'process': 'Async Flush', 'pageNumber': 0, 'mode': 'reserved' })

    before(function(){

      initializeSams = function (requirements, secondChance, asyncFlush) {
        sams = new Scheduler();
        sams.setAlgorithm("lru");
        secondChance = secondChance || false;
        asyncFlush = asyncFlush || false;
        sams.setSecondChanceReplacementPolicy(secondChance);
        sams.setAsyncFlushReplacementPolicy(asyncFlush);
        sams.setMemorySize(3);
        reqs = requirements;
        sams.addRequirements(reqs);
      }

      comparingInstant = function (inst, expected) {
        var ret = true;
        inst.forEach(function(jsPage, index) {
          ret =  ret && ( (expected[index].equals((new Page(jsPage))))
                        && (expected[index].pageFault == (jsPage.pageFault))
                        && (expected[index].referenced == (jsPage.referenced))
                        && (expected[index].modified == (jsPage.modified)) );
        });
        return ret;
      }

      createPageExpected = function (req, pf, ref, mod) {
        return new Page({ 'process': req.getProcess(), 'pageNumber': req.getPageNumber(), 'mode': req.getMode(),
          'pageFault': pf, 'referenced': ref, 'modified': mod }) ;
      }
    });

    beforeEach(function() {
      req1 = new Requirement({ 'process': 'A', 'pageNumber': 1, 'mode' : 'read' });
      req2 = new Requirement({ 'process': 'B', 'pageNumber': 2, 'mode' : 'read' });
      req3 = new Requirement({ 'process': 'C', 'pageNumber': 1, 'mode' : 'read' });
      req4 = new Requirement({ 'process': 'A', 'pageNumber': 1, 'mode' : 'write' });
      req5 = new Requirement({ 'process': 'B', 'pageNumber': 3, 'mode' : 'read' });
      req6 = new Requirement({ 'process': 'C', 'pageNumber': 1, 'mode' : 'write' });
      req7 = new Requirement({ 'process': 'C', 'pageNumber': 4, 'mode' : 'read' });
      page1 = req1.asPage();
      page2 = req2.asPage();
      page3 = req3.asPage();
      page4 = req4.asPage();
      page5 = req5.asPage();
      page6 = req6.asPage();
      page7 = req7.asPage();
    });

    describe('Asignacion dinámica - Reemplazo global', function () {

      it('#Analizando instante 0', function () {
        requirements = [req1, req2, req3, req4, req5, req6, req5, req7];
        initializeSams(requirements);
        var instants = sams.run();

        var expected = [createPageExpected(page1, true, true, false)];
        assert.equal(true, comparingInstant(instants[0],expected));
      });

      it('#Analizando instante 2', function () {
        requirements = [req1, req2, req3, req4, req5, req6, req5, req7];
        initializeSams(requirements);
        reqs = [req1, req2, req3, req4, req5, req6, req5, req7];
        sams.addRequirements(reqs);
        var instants = sams.run();

        var expected = [createPageExpected(page1, false, false, false),
                      createPageExpected(page2, false, false, false),
                      createPageExpected(page3, true, true, false)
                    ];
        assert.equal(true, comparingInstant(instants[2], expected));

      });

      it('#Analizando instante 3', function () {
        requirements = [req1, req2, req3, req4, req5, req6, req5, req7];
        initializeSams(requirements);
        var instants = sams.run();

        var expected = [createPageExpected(page4, false, true, true),
                      createPageExpected(page2, false, false, false),
                      createPageExpected(page3, false, false, false),
                    ];
        assert.equal(true, comparingInstant(instants[3], expected));

      });

      it('#Analizando instante 5', function () {
        requirements = [req1, req2, req3, req4, req5, req6, req5, req7];
        initializeSams(requirements);
        var instants = sams.run();

        var expected = [createPageExpected(page1, false, false, true),
                      createPageExpected(page5, false, false, false),
                      createPageExpected(page6, false, true, true),
                    ];
        assert.equal(true, comparingInstant(instants[5], expected));

      });

      it('#Analizando instante 7', function () {
        requirements = [req1, req2, req3, req4, req5, req6, req5, req7];
        initializeSams(requirements);
        var instants = sams.run();

        var expected = [createPageExpected(page7, true, true, false),
                      createPageExpected(page5, false, false, false),
                      createPageExpected(page6, false, false, true),
                    ];
        assert.equal(true, comparingInstant(instants[7], expected));

      });

    });

    describe('Asignacion dinámica - Reemplazo global - 2da', function () {

      it('#Analizando instante 4', function () {
        requirements = [req1, req2, req3, req4, req5, req6, req7, req5];
        initializeSams(requirements, true);
        var instants = sams.run();

        var expected = [createPageExpected(page1, false, true, true),
                      createPageExpected(page5, true, true, false),
                      createPageExpected(page6, false, false, false),
                    ];
        // console.log(instants[4]);
        // console.log(expected);
        assert.equal(true, comparingInstant(instants[4], expected));
      });

      it('#Analizando instante 6', function () {
        requirements = [req1, req2, req3, req4, req5, req6, req7, req5];
        initializeSams(requirements, true);
        var instants = sams.run();

        var expected = [createPageExpected(page4, false, false, true),
                      createPageExpected(page7, true, true, false),
                      createPageExpected(page6, false, false, true),
                    ];
        assert.equal(true, comparingInstant(instants[6], expected));
      });

      it('#Analizando instante 7', function () {
        requirements = [req1, req2, req3, req4, req5, req6, req7, req5];
        initializeSams(requirements, true);
        var instants = sams.run();

        var expected = [createPageExpected(page4, false, false, true),
                      createPageExpected(page7, false, false, false),
                      createPageExpected(page5, true, true, false),
                    ];
        assert.equal(true, comparingInstant(instants[7], expected));
      });

    });

    describe('Asignacion dinámica - Reemplazo global - DA', function () {

      it('#Analizando instante 2', function () {
        requirements = [req1, req2, req4, req6, req7, req5];
        initializeSams(requirements, false, true);
        var instants = sams.run();
        instants.forEach(function(instant, index) {
          console.log("Moment: " + index);
          console.log(instant);
        });
        // var page = new Requirement({ 'process': 'Async Flush', 'pageNumber': 0, 'mode': 'reserved' })
        var expected = [createPageExpected(pageDA, false, false, false),
                      createPageExpected(page4, false, true, true),
                      createPageExpected(page2, false, false, false),
                    ];
        assert.equal(true, comparingInstant(instants[2], expected));
      });

      it('#Analizando instante 3', function () {
        requirements = [req1, req2, req4, req6, req7, req5];
        initializeSams(requirements, false, true);
        var instants = sams.run();

        var expected = [createPageExpected(pageDA, false, false, false),
                      createPageExpected(page4, false, false, false),
                      createPageExpected(page6, true, true, false),
                    ];
        assert.equal(true, comparingInstant(instants[3], expected));
      });

      it('#Analizando instante 4', function () {
        requirements = [req1, req2, req4, req6, req7, req5];
        initializeSams(requirements, false, true);
        var instants = sams.run();

        var expected = [createPageExpected(page7, true, true, false),
                      createPageExpected(page4, false, false, true),
                      createPageExpected(pageDA, false, false, false),
                    ];
        assert.equal(true, comparingInstant(instants[4], expected));
      });

      it('#Analizando instante 5', function () {
        requirements = [req1, req2, req4, req6, req7, req5];
        initializeSams(requirements, false, true);
        var instants = sams.run();

        var expected = [createPageExpected(page7, false, false, false),
                      createPageExpected(pageDA, false, false, false),
                      createPageExpected(page5, true, true, false),
                    ];
        assert.equal(true, comparingInstant(instants[5], expected));
      });
    });

    describe('Asignacion Fija - Reemplazo Local - Lru', function () {

      it('-', function () {
        reqs = [];
        sams.addRequirements(reqs);

      });

      it('-', function () {
        reqs = [];
        sams.addRequirements(reqs);

      });
    });

  });
}
