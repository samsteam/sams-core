var assert = require("assert");

var Behavior = require('../../src/algorithms/Lru.js');

var Requirement = require('../../src/common/Requirement.js');
var Page = require('../../src/common/Page.js');
var Scheduler  = require('../../src/Scheduler');


module.exports = function() {

	describe('LRU', function() {


		initializeSams = function (memorySize, reqs, secondChance, asyncFlush, localRepl, fixedEvenAssig) {
			secondChance = secondChance || false;
			asyncFlush = asyncFlush || false;
			localRepl = localRepl || false;
			fixedEvenAssig = fixedEvenAssig || undefined;
			sams = new Scheduler();
			sams.setAlgorithm("lru");
			sams.setSecondChanceFilter(secondChance);
			sams.setLocalReplacementPolicy(localRepl);
			sams.setPageBufferingFilter(asyncFlush);
			sams.setMemorySize(memorySize);
			sams.setFixedEvenAssignmentPolicy(fixedEvenAssig);
			sams.addRequirements(reqs);

		}

		createPageExpected = function (req, required, pageF, ref, modified, finish, reservedForPageBuffering) {
			required = required || false;
			pageF = pageF || false;
			ref = ref || false;
			modified = modified || false;
			reservedForPageBuffering = reservedForPageBuffering || false;
			finish = finish || false;
			return (new Page({ 'process': req.getProcess(),
				'pageNumber': req.getPageNumber(),
				'mode': req.getMode(),
				'pageFault': pageF,
				'required': required,
				'referenced': ref,
				'modified': modified,
				'finished': finish,
				'reservedForPageBuffering': reservedForPageBuffering
				})).clone();
		}

///////////////////////////

//    La funcion comparingInstant(...) en sus 2 versiones
//  quedan comentadas para tenerlas a mano. Se pudo solucionar
//  muy facilmente, pero si en un futuro hay nuevos cambios
//  pueden llegar a ser utiles

///////////////////////////

/*    comparingInstant = function (inst, expected) {
			var ret = [];
			var err = false;
			inst.forEach(function(jsPage, index) {
				if (expected[index].process != jsPage.process) {
					err = true;
					ret.unshift("Not equals process Expected: " + expected[index].process + " Found: "+ jsPage.process);
				}
				else {
					if (expected[index].finished != (jsPage.finished)) {
						err = true;
						ret.unshift("Not equals flag finished Expected: " + expected[index].finished + " Found: "+ jsPage.finished);
					}
					if (expected[index].referenced != (jsPage.referenced)) {
						err = true;
						ret.unshift("Not equals flag referenced Expected: " + expected[index].referenced + " Found: "+ jsPage.referenced);
					}
					if (expected[index].modified != (jsPage.modified)) {
						err = true;
						ret.unshift("Not equals flag modified Expected: " + expected[index].modified + " Found: "+ jsPage.modified);
					}
					if (expected[index].pageNumber != jsPage.pageNumber){
						err = true;
						ret.unshift("Not equals page number Expected: " + expected[index].pageNumber + " Found: "+ jsPage.pageNumber);
					}
				}
				if (err) {
					ret.unshift(jsPage);
					ret.unshift("Frame Found: ");
					ret.unshift(expected[index]);
					ret.unshift("Not equals process. Frame Expected: ");
				}
			});
			return ret;
		}

		comparingInstant = function (inst, expected) {
			inst.forEach(function(jsPage, index) {
				assert.equal(expected[index].process, jsPage.process);
				assert.equal(expected[index].pageNumber, jsPage.pageNumber);
				assert.equal(expected[index].referenced, jsPage.referenced);
				assert.equal(expected[index].modified, jsPage.modified);
				assert.notEqual(expected[index].finished, jsPage.finished);
			});
		}
*/
			comparingInstant = function (inst, expected) {
				inst.forEach(function(jsPage, index) {
					assert.deepEqual(jsPage, expected[index], "Frame: " + index);
				});
		}


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
		pageEmpty = Page.empty().asDataObject();
		pageDA = createPageExpected(new Requirement({ 'process': '', 'pageNumber': 0, 'mode': 'reserved' }),
																false, false, false, false, false, true);
		before(function(){

		});

		describe('Asignacion dinámica - Reemplazo global', function () {

			requirements = [req1, req2, req3, req4, req5, req6, req5, req7];
			initializeSams(3, requirements);
			var instants = sams.run();
			it('#Analizando instante 0', function () {
				expected = [createPageExpected(page1, true, true), pageEmpty,pageEmpty];
				comparingInstant(instants[0].frames, expected);
				// assert.deepEqual(instants[0].frames, qexpected);
				assert.equal(true, instants[1].pageFault);
			});

			it('#Analizando instante 2', function () {
				expected = [createPageExpected(page1),
										createPageExpected(page2),
										createPageExpected(page3, true, true)
										];
				comparingInstant(instants[2].frames, expected);
				// assert.deepEqual(instants[2].frames, expected);
				assert.equal(true, instants[2].pageFault);

			});

			it('#Analizando instante 3', function () {

				expected = [createPageExpected(page4, true, false, true, true),
											createPageExpected(page2),
											createPageExpected(page3),
										];
				comparingInstant(instants[3].frames, expected);
				// assert.deepEqual(instants[3].frames, expected);
				assert.equal(false, instants[3].pageFault);
			});

			it('#Analizando instante 5', function () {

				expected = [createPageExpected(page1, false, false, true, true),
										createPageExpected(page5),
										createPageExpected(page6, true, false, true, true),
										];
				comparingInstant(instants[5].frames, expected);
				// assert.deepEqual(instants[5].frames, expected);
				assert.equal(false, instants[5].pageFault);
			});

			it('#Analizando instante 7', function () {

				expected = [createPageExpected(page7, true, true),
										createPageExpected(page5, false, false, true),
										createPageExpected(page6, false, false, true, true),
										];
				comparingInstant(instants[7].frames, expected);
				// assert.deepEqual(instants[7].frames, expected);
				assert.equal(true, instants[7].pageFault);
			});
		});

		describe('Asignacion dinámica - Reemplazo global - DA', function () {

			requirements = [req1, req2, req4, req6, req7, req5];
			initializeSams(3, requirements, false, true);
			var instants = sams.run();

			it('#Analizando instante 2', function () {
				expected = [pageDA,
										createPageExpected(page4, true, false, true, true),
										createPageExpected(page2),
										];
				comparingInstant(instants[2].frames, expected);
				// assert.deepEqual(instants[2].frames, expected);
				assert.equal(false, instants[2].pageFault);
			});

			it('#Analizando instante 3', function () {

				expected = [pageDA,
										createPageExpected(page4, false, false, true, true),
										createPageExpected(page6, true, true, false, true),
										];
				comparingInstant(instants[3].frames, expected);
				// assert.deepEqual(instants[3].frames, expected);
				assert.equal(true, instants[3].pageFault);
			});

			it('#Analizando instante 4', function () {

				expected = [createPageExpected(page7, true, true),
										pageDA,
										createPageExpected(page6, false, false, false, true),
										];
				comparingInstant(instants[4].frames, expected);
				// assert.deepEqual(instants[4].frames, expected);
				assert.equal(true, instants[4].pageFault);
			});

			it('#Analizando instante 5', function () {

				expected = [createPageExpected(page7),
										createPageExpected(page5, true, true),
										pageDA,
										];
				// console.log(instants[5].frames);
				// console.log("asdasda");
				// console.log(expected);
				comparingInstant(instants[5].frames, expected);
				// assert.deepEqual(instants[5].frames, expected);
				assert.equal(true, instants[5].pageFault);
			});
		});

		describe('Asignacion Fija - Reemplazo Local', function () {

			// Requerimientos: B2 C1 B3 B2 B4m C1m C4 C5
			requirements = [req2, req3, req5, req2, req9, req6, req7, req8];
			initializeSams(4, requirements, false, false, true, 2);
			var instants = sams.run();

			it('#Analizando instante 0', function () {
				expected = [createPageExpected(page2, true, true), pageEmpty, pageEmpty, pageEmpty];

				comparingInstant(instants[0].frames, expected);
				// assert.deepEqual(instants[0].frames, expected);
				assert.equal(true, instants[0].pageFault);
			});

			it('#Analizando instante 1', function () {
				expected = [createPageExpected(page2),
										createPageExpected(page3, true, true),
										pageEmpty,
										pageEmpty];

				comparingInstant(instants[1].frames, expected);
				// assert.deepEqual(instants[1].frames, expected);
				assert.equal(true, instants[1].pageFault);
			});

			it('#Analizando instante 3', function () {
				expected = [createPageExpected(page2, true, false, true),
										createPageExpected(page3),
										createPageExpected(page5),
										pageEmpty];

				comparingInstant(instants[3].frames, expected);
				//assert.deepEqual(instants[3].frames, expected);
				assert.equal(false, instants[3].pageFault);
			});

			it('#Analizando instante 4', function () {
				expected = [createPageExpected(page2, false, false, true),
										createPageExpected(page3),
										createPageExpected(page9, true, true, false, true),
										pageEmpty];

				comparingInstant(instants[4].frames, expected);
				// assert.deepEqual(instants[4].frames, expected);
				assert.equal(true, instants[4].pageFault);
			});

			it('#Analizando instante 5', function () {
				expected = [createPageExpected(page2, false, false, true),
										createPageExpected(page6, true, false, true, true),
										createPageExpected(page9, false, false, false, true),
										pageEmpty];
				comparingInstant(instants[5].frames, expected);
				// assert.deepEqual(instants[5].frames, expected);
				assert.equal(false, instants[5].pageFault);
			});

			it('#Analizando instante 7', function () {
				expected = [createPageExpected(page2, false, false, true),
										createPageExpected(page8, true, true),
										createPageExpected(page9, false, false, false, true),
										createPageExpected(page7)];
				comparingInstant(instants[7].frames, expected);
				// assert.deepEqual(instants[7].frames, expected);
				assert.equal(true, instants[7].pageFault);
			});
		});

		describe('Asignacion Fija - Reemplazo Local - DA', function () {

			// Requerimientos: B2 C1 B3 B2 B4m C1m C4 C5 B3 B2
			requirements = [req2, req3, req5, req2, req9, req6, req7, req8, req5, req2];
			initializeSams(5, requirements, false, true, true, 2);
			var instants = sams.run();

			it('#Analizando instante 4', function () {
				expected = [pageDA,
										createPageExpected(page2, false, false, true),
										createPageExpected(page3),
										createPageExpected(page9, true, true, false, true),
										pageEmpty];
				comparingInstant(instants[4].frames, expected);
				// assert.deepEqual(instants[4].frames, expected);
				assert.equal(true, instants[4].pageFault);
			});
			// required, pageF, ref, modified, finish, reservedForPageBuffering

			it('#Analizando instante 7', function () {
				expected = [createPageExpected(page8, true, true),
										createPageExpected(page2, false, false, true),
										pageDA,
										createPageExpected(page9, false, false, false, true),
										createPageExpected(page7)];

				comparingInstant(instants[7].frames, expected);
				// assert.deepEqual(instants[8].frames, expected);
				assert.equal(true, instants[7].pageFault);
			});

			it('#Analizando instante 8', function () {
				expected = [createPageExpected(page8),
										createPageExpected(page5, true, true),
										pageDA,
										createPageExpected(page9, false, false, false, true),
										createPageExpected(page7)];

				comparingInstant(instants[8].frames, expected);
				// assert.deepEqual(instants[8].frames, expected);
				assert.equal(true, instants[8].pageFault);
			});

			it('#Analizando instante 9', function () {
				expected = [createPageExpected(page8),
										createPageExpected(page5),
										createPageExpected(page2, true, true),
										pageDA,
										createPageExpected(page7)];
				comparingInstant(instants[9].frames, expected);
				// assert.deepEqual(instants[9].frames, expected);
				assert.equal(true, instants[9].pageFault);
			});
		});

	});
}
