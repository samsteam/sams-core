var assert = require("assert");

var Behavior = require('../../src/algorithms/Lru.js');

var Page = require('../../src/common/Page.js');
var Requirement = require('../../src/common/Requirement.js');
var Scheduler  = require('../../src/Scheduler');


module.exports = function() {

  describe('LRU', function() {

    req1 = new Requirement({ 'process': 'A', 'pageNumber': 1, 'mode' : 'read' });
    req2 = new Requirement({ 'process': 'B', 'pageNumber': 2, 'mode' : 'read' });
    req3 = new Requirement({ 'process': 'C', 'pageNumber': 1, 'mode' : 'read' });
    req4 = new Requirement({ 'process': 'A', 'pageNumber': 1, 'mode' : 'write' });
    req5 = new Requirement({ 'process': 'B', 'pageNumber': 3, 'mode' : 'read' });
    req6 = new Requirement({ 'process': 'C', 'pageNumber': 1, 'mode' : 'write' });
    req7 = new Requirement({ 'process': 'C', 'pageNumber': 4, 'mode' : 'read' });
    req8 = new Requirement({ 'process': 'C', 'pageNumber': 5, 'mode' : 'read' });
    req9 = new Requirement({ 'process': 'B', 'pageNumber': 4, 'mode' : 'write' });
    page1 = req1.asPage();
    page2 = req2.asPage();
    page3 = req3.asPage();
    page4 = req4.asPage();
    page5 = req5.asPage();
    page6 = req6.asPage();
    page7 = req7.asPage();
    page8 = req8.asPage();
    page9 = req9.asPage();
    pageDA = new Requirement({ 'process': '', 'pageNumber': 0, 'mode': 'reserved' });

    initializeSams = function (memorySize, reqs, secondChance, asyncFlush, localRepl, fixedEvenAssig) {
      secondChance = secondChance || false;
      asyncFlush = asyncFlush || false;
      localRepl = localRepl || false;

      sams = new Scheduler();
      sams.setAlgorithm("lru");
      sams.setSecondChanceReplacementPolicy(secondChance);
      sams.setAsyncFlushReplacementPolicy(asyncFlush);
      sams.setLocalReplacementPolicy(localRepl);
      sams.setFixedEvenAssignmentPolicy(fixedEvenAssig);
      sams.setMemorySize(memorySize);

      sams.addRequirements(reqs);
    }

    createPageExpected = function (page, pf, ref, mod, reservedForAsyncFlush) {
      // pf = pf || false;
      // ref = pf || false;
      // mod = mod || false;
      reservedForAsyncFlush = reservedForAsyncFlush || false;
      return (new Page({ 'process': page.getProcess(),
        'pageNumber': page.getPageNumber(),
        'mode': page.getMode(),
        'pageFault': pf, 'referenced': ref, 'modified': mod,
        'reservedForAsyncFlush': reservedForAsyncFlush})).clone();
    }

    // comparingInstant = function (inst, expected) {
    //   var ret = true;
    //   inst.forEach(function(jsPage, index) {
    //     ret =  ret && ( (expected[index].equals((new Page(jsPage))))
    //                   && (expected[index].referenced == (jsPage.referenced))
    //                   && (expected[index].modified == (jsPage.modified)) );
    //   });
    //   return ret;
    // }

    before(function(){

    });

    describe('Asignacion dinámica - Reemplazo global', function () {

      requirements = [req1, req2, req3, req4, req5, req6, req5, req7];
      initializeSams(3, requirements);
      var instants = sams.run();

      it('#Analizando instante 0', function () {

        expected = [createPageExpected(page1, true, true, false)];
        // assert.equal(true, comparingInstant(instants[0].frames, expected));
        assert.deepEqual(instants[0].frames, expected);
        assert.equal(true, instants[1].pageFault);
      });

      it('#Analizando instante 2', function () {

        expected = [createPageExpected(page1, false, false, false),
                      createPageExpected(page2, false, false, false),
                      createPageExpected(page3, true, true, false)
                    ];
        // assert.equal(true, comparingInstant(instants[2].frames, expected));
        assert.deepEqual(instants[2].frames, expected);
        assert.equal(true, instants[2].pageFault);

      });

      it('#Analizando instante 3', function () {

        expected = [createPageExpected(page4, false, true, true),
                      createPageExpected(page2, false, false, false),
                      createPageExpected(page3, false, false, false),
                    ];
        // assert.equal(true, comparingInstant(instants[3].frames, expected));
        assert.deepEqual(instants[3].frames, expected);
        assert.equal(false, instants[3].pageFault);
      });

      it('#Analizando instante 5', function () {

        expected = [createPageExpected(page1, false, false, true),
                      createPageExpected(page5, false, false, false),
                      createPageExpected(page6, false, true, true),
                    ];
        // assert.equal(true, comparingInstant(instants[5].frames, expected));
        assert.deepEqual(instants[5].frames, expected);
        assert.equal(false, instants[5].pageFault);
      });

      it('#Analizando instante 7', function () {

        expected = [createPageExpected(page7, true, true, false),
                      createPageExpected(page5, false, false, false),
                      createPageExpected(page6, false, false, true),
                    ];
        // assert.equal(true, comparingInstant(instants[7].frames, expected));
        assert.deepEqual(instants[7].frames, expected);
        assert.equal(true, instants[7].pageFault);
      });

    });

    describe('Asignacion dinámica - Reemplazo global - DA', function () {

      requirements = [req1, req2, req4, req6, req7, req5];
      initializeSams(3, requirements, false, true);
      var instants = sams.run();

      it('#Analizando instante 2', function () {
        expected = [createPageExpected(pageDA, false, false, false, true),
                      createPageExpected(page4, false, true, true),
                      createPageExpected(page2, false, false, false),
                    ];
        // assert.equal(true, comparingInstant(instants[2].frames, expected));
        assert.deepEqual(instants[2].frames, expected);
        assert.equal(false, instants[2].pageFault);
      });

      it('#Analizando instante 3', function () {

        expected = [createPageExpected(pageDA, false, false, false, true),
                      createPageExpected(page4, false, false, true),
                      createPageExpected(page6, true, true, true),
                    ];
        // assert.equal(true, comparingInstant(instants[3].frames, expected));
        assert.deepEqual(instants[3].frames, expected);
        assert.equal(true, instants[3].pageFault);
      });

      it('#Analizando instante 4', function () {

        expected = [createPageExpected(page7, true, true, false),
                      createPageExpected(pageDA, false, false, false, true),
                      createPageExpected(page6, false, false, true),
                    ];
        // assert.equal(true, comparingInstant(instants[4].frames, expected));
        assert.deepEqual(instants[4].frames, expected);
        assert.equal(true, instants[4].pageFault);
      });

      it('#Analizando instante 5', function () {

        expected = [createPageExpected(page7, false, false, false),
                      createPageExpected(page5, true, true, false),
                      createPageExpected(pageDA, false, false, false, true),
                    ];
        // console.log(instants[3].frames);
        // console.log(instants[4].frames);
        // console.log(instants[5].frames);
        // console.log("\n" + "EX");
        // console.log(expected);
        // assert.equal(true, comparingInstant(instants[5].frames, expected));
        assert.deepEqual(instants[5].frames, expected);
        assert.equal(true, instants[5].pageFault);
      });
    });

    describe('Asignacion Fija - Reemplazo Local', function () {

      // Requerimientos: B2 C1 B3 B2 B4m C1m C4 C5
      requirements = [req2, req3, req5, req2, req9, req6, req7, req8];
      initializeSams(4, requirements, false, false, true, 2);
      var instants = sams.run();

      it('#Analizando instante 0', function () {
        expected = [createPageExpected(page2, true, true, false)];

        assert.deepEqual(instants[0].frames, expected);
        assert.equal(true, instants[0].pageFault);
      });

      it('#Analizando instante 1', function () {
        expected = [createPageExpected(page2, false, false, false),
                        createPageExpected(page3, true, true, false)];

        assert.deepEqual(instants[1].frames, expected);
        assert.equal(true, instants[1].pageFault);
      });

      it('#Analizando instante 4', function () {
        expected = [createPageExpected(page2, false, false, false),
                        createPageExpected(page3, false, false, false),
                        createPageExpected(page9, true, true, true)];

        assert.deepEqual(instants[4].frames, expected);
        assert.equal(true, instants[4].pageFault);
      });

      it('#Analizando instante 4', function () {
        expected = [createPageExpected(page2, false, false, false),
                        createPageExpected(page3, false, false, false),
                        createPageExpected(page9, true, true, true)];

        assert.deepEqual(instants[4].frames, expected);
        assert.equal(true, instants[4].pageFault);
      });

      it('#Analizando instante 5', function () {
        expected = [createPageExpected(page2, false, false, false),
                        createPageExpected(page6, false, true, true),
                        createPageExpected(page9, false, false, true)];
        assert.deepEqual(instants[5].frames, expected);
        assert.equal(false, instants[5].pageFault);
      });

      it('#Analizando instante 7', function () {
        expected = [createPageExpected(page2, false, false, false),
                        createPageExpected(page8, true, true, false),
                        createPageExpected(page9, false, false, true),
                        createPageExpected(page7, false, false, false)];
        assert.deepEqual(instants[7].frames, expected);
        assert.equal(true, instants[7].pageFault);
      });
    });

    describe('Asignacion Fija - Reemplazo Local - DA', function () {

      // Requerimientos: B2 C1 B3 B2 B4m C1m C4 C5 B3 B2
      requirements = [req2, req3, req5, req2, req9, req6, req7, req8, req5, req2];
      initializeSams(5, requirements, false, true, true, 2);
      var instants = sams.run();

      it('#Analizando instante 4', function () {
        expected = [createPageExpected(pageDA, false, false, false, true),
                    createPageExpected(page2, false, false, false),
                    createPageExpected(page3, false, false, false),
                    createPageExpected(page9, true, true, true)];
        assert.deepEqual(instants[4].frames, expected);
        assert.equal(true, instants[4].pageFault);
      });

      it('#Analizando instante 8', function () {
        expected = [createPageExpected(page8, false, false, false),
                    createPageExpected(page5, true, true, false),
                    createPageExpected(pageDA, false, false, false, true),
                    createPageExpected(page9, false, false, true),
                    createPageExpected(page7, false, false, false)];
        assert.deepEqual(instants[8].frames, expected);
        assert.equal(true, instants[8].pageFault);
      });

      it('#Analizando instante 9', function () {
        expected = [createPageExpected(page8, false, false, false),
                    createPageExpected(page5, false, false, false),
                    createPageExpected(page2, true, true, false),
                    createPageExpected(pageDA, false, false, false, true),
                    createPageExpected(page7, false, false, false)];
        console.log(instants[9].frames);
        console.log(expected);
        assert.deepEqual(instants[9].frames, expected);
        assert.equal(true, instants[9].pageFault);
      });
    });

  });
}
