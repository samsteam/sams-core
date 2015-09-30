
var assert = require("assert");
require('it-each')();
require('it-each')({ testPerIteration: true });

var Behavior = require('../../src/algorithms/Lru.js');

var Page = require('../../src/common/Page.js');
var Requirement = require('../../src/common/Requirement.js');
var Scheduler  = require('../../src/Scheduler');
var FactoryFifoGlobalDynamicPb = require('./helpers/resultFactories/fifoGlobalDynamicPb');
var FactoryLocalFixedEven = require("./helpers/resultFactories/fifoLocalFixedEven")

module.exports = function() {

  describe('FIFO', function() {
    var initializeSams = function (requirements, memorySize, secondChance, asyncFlush, local) {
      var sams = new Scheduler();
      sams.setAlgorithm("fifo");
      sams.setSecondChanceFilter(secondChance);
      sams.setPageBufferingFilter(asyncFlush);
      sams.setMemorySize(memorySize);
      if (local) {
        sams.setFixedEvenAssignmentPolicy(true);
        sams.setLocalReplacementPolicy(true);
      }
      sams.addRequirements(requirements);
      return sams;
    };

    var deleteFinishedAttributeFromInstant = function (instant) {
      instant["victim"] && delete instant["victim"].finished;
      var j;
      for (j = 0; j < instant["potentialVictims"].length; j++) {
        delete instant["potentialVictims"][j].finished;
      }
    }

    var deleteReferencedAttributeFromInstant = function (instant) {
      instant["victim"] && delete instant["victim"].referenced;
      var j;
      for (j = 0; j < instant["frames"].length; j++) {
        delete instant["frames"][j].referenced;
      }
      for (j = 0; j < instant["potentialVictims"].length; j++) {
        delete instant["potentialVictims"][j].referenced;
      }
    }

    var cleanNonUsedFrames = function (frames) {
      var j;
      for (j = 0; j < frames.length; j++) {
        if (frames[j]["finished"]) {
          delete frames[j]["process"];
          delete frames[j]["pageNumber"];
          delete frames[j]["referenced"];
          delete frames[j]["modified"];
          delete frames[j]["pageFault"];
          delete frames[j]["required"];
          delete frames[j]["reservedForPageBuffering"];
        }
      }
    }

    // var cleanPageBufferingReservedFrame = function (frames) {
    //   var j;
    //   for (j = 0; j < frames.length; j++) {
    //     if (frames[j]["reservedForPageBuffering"]) {
    //       delete frames[j]["process"];
    //       delete frames[j]["pageNumber"];
    //       delete frames[j]["referenced"];
    //       delete frames[j]["modified"];
    //       delete frames[j]["pageFault"];
    //       delete frames[j]["required"];
    //       delete frames[j]["finished"];
    //     }
    //   }
    // }

    var adaptInstantsGlobal2ndChance = function (instants) {
      var i;
      for (i = 0; i < instants.length; i++) {
        // instants[i]["victim"] && delete instants[i]["victim"].finished;
        // var j;
        // for (j = 0; j < instants[i]["potentialVictims"].length; j++) {
        //   delete instants[i]["potentialVictims"][j].finished;
        // }
        deleteFinishedAttributeFromInstant(instants[i]);
        cleanNonUsedFrames(instants[i]["frames"]);
      }
      return instants;
    }

    var adaptInstantsGlobalPageBuffering = function (instants) {
      var i;
      for (i = 0; i < instants.length; i++) {
        deleteFinishedAttributeFromInstant(instants[i]);
        deleteReferencedAttributeFromInstant(instants[i]);
        cleanNonUsedFrames(instants[i]["frames"]);
      }
      return instants;
    }

    var adaptInstantsLocalFixedEven = function (instants) {
      var i;
      for (i = 0; i < instants.length; i++) {
        instants[i]["frames"].sort(function (a, b) {
          a.process = a.process || "";
          a.pageNumber = a.pageNumber || 0;
          b.process = b.process || "";
          b.pageNumber = b.pageNumber || 0;
          if ((a.process + a.pageNumber.toString()) < (b.process + b.pageNumber.toString()))
            return -1;
          if ((a.process + a.pageNumber.toString()) > (b.process + b.pageNumber.toString()))
            return 1;
          return 0;
        });
        deleteFinishedAttributeFromInstant(instants[i]);
        deleteReferencedAttributeFromInstant(instants[i]);
        cleanNonUsedFrames(instants[i]["frames"]);
      }
      return instants;
    }

    var adaptExpectedInstantsLocalFixedEven = function (instants) {
      var i;
      for (i = 0; i < instants.length; i++) {
        instants[i]["frames"].sort(function (a, b) {
          a.process = a.process || "";
          a.pageNumber = a.pageNumber || 0;
          b.process = b.process || "";
          b.pageNumber = b.pageNumber || 0;
          if ((a.process + a.pageNumber.toString()) < (b.process + b.pageNumber.toString()))
            return -1;
          if ((a.process + a.pageNumber.toString()) > (b.process + b.pageNumber.toString()))
            return 1;
          return 0;
        });
      }
      return instants;
    }

    before(function() {

    });

    beforeEach(function() {

    });

    describe('Global Dynamic 2nd chance', function() {
      var requirements = [
        { 'process': 'B', 'pageNumber': 2, 'mode' : 'read' },
        { 'process': 'B', 'pageNumber': 4, 'mode' : 'read' },
        { 'process': 'A', 'pageNumber': 1, 'mode' : 'read' },
        { 'process': 'A', 'pageNumber': 3, 'mode' : 'read' },
        { 'process': 'A', 'pageNumber': 1, 'mode' : 'read' },
        { 'process': 'C', 'pageNumber': 1, 'mode' : 'read' },
        { 'process': 'C', 'pageNumber': 2, 'mode' : 'read' },
        { 'process': 'B', 'pageNumber': 6, 'mode' : 'read' },
        { 'process': 'B', 'pageNumber': 2, 'mode' : 'read' },
        { 'process': 'B', 'pageNumber': 4, 'mode' : 'read' },
        { 'process': 'A', 'pageNumber': 2, 'mode' : 'read' },
        { 'process': 'A', 'pageNumber': 4, 'mode' : 'read' },
        { 'process': 'A', 'pageNumber': 1, 'mode' : 'read' },
        { 'process': 'C', 'pageNumber': 4, 'mode' : 'read' },
        { 'process': 'C', 'pageNumber': 8, 'mode' : 'read' },
        { 'process': 'B', 'pageNumber': 1, 'mode' : 'read' },
        { 'process': 'B', 'pageNumber': 8, 'mode' : 'read' },
        { 'process': 'C', 'pageNumber': 6, 'mode' : 'read' },
        { 'process': 'C', 'pageNumber': 1, 'mode' : 'read' },
        { 'process': 'C', 'pageNumber': 4, 'mode' : 'read' },
        { 'process': 'C', 'pageNumber': 1, 'mode' : 'read' },
        { 'process': 'A', 'pageNumber': 5, 'mode' : 'read' },
        { 'process': 'A', 'pageNumber': 1, 'mode' : 'read' },
        { 'process': 'A', 'pageNumber': 4, 'mode' : 'read' },
        { 'process': 'B', 'pageNumber': 3, 'mode' : 'read' },
        { 'process': 'B', 'pageNumber': 1, 'mode' : 'read' },
        { 'process': 'B', 'pageNumber': 8, 'mode' : 'read' },
        { 'process': 'C', 'pageNumber': 0, 'mode' : 'finish' },
        { 'process': 'A', 'pageNumber': 7, 'mode' : 'read' },
        { 'process': 'A', 'pageNumber': 9, 'mode' : 'read' },
        { 'process': 'A', 'pageNumber': 4, 'mode' : 'read' },
        { 'process': 'B', 'pageNumber': 0, 'mode' : 'finish' },
        { 'process': 'A', 'pageNumber': 0, 'mode' : 'finish' }
      ];
      var sams = initializeSams(requirements, 7, true, false);
      var expectedInstants = require("./helpers/resultFactories/fifoGlobalDynamic2ndChance");

      var obtainedInstants = sams.run();
      obtainedInstants = adaptInstantsGlobal2ndChance(obtainedInstants);

      it('#Amount of instants', function() {
        console.log(expectedInstants.length);
        assert.equal(obtainedInstants.length, expectedInstants.length);
      });

      // it.each(obtainedInstants, '#Instant %s', ['x'], function(element){
      //   var index = obtainedInstants.indexOf(element);
      //   assert.deepEqual(element, expectedInstants[index], "FUCK THIS SHIT");
      // });

      it.each(obtainedInstants, '#Instant %s', ['x'], function(element){
        var i = obtainedInstants.indexOf(element);
        assert.deepEqual(obtainedInstants[i]["requirement"], expectedInstants[i]["requirement"], "Requirement error");
        assert.equal(obtainedInstants[i]["pageFault"], expectedInstants[i]["pageFault"], "Page fault error");
        assert.deepEqual(obtainedInstants[i]["victim"], expectedInstants[i]["victim"], "Victim error");
        var j;
        for (j = 0; j < obtainedInstants[i]["frames"].length; j++) {
          assert.deepEqual(obtainedInstants[i]["frames"][j], expectedInstants[i]["frames"][j], "Frame " + j + " failed");
        }
        var k;
        for (k = 0; k < obtainedInstants[i]["potentialVictims"].length; k++) {
          assert.deepEqual(obtainedInstants[i]["potentialVictims"][k], expectedInstants[i]["potentialVictims"][k], "Potential victim " + k + " failed");
        }
      });
    });

      describe('Global Dynamic with Page buffering', function() {
      var requirements = FactoryFifoGlobalDynamicPb.getRequirements();
      var sams = initializeSams(requirements, 7, false, true);
      var expectedInstants = FactoryFifoGlobalDynamicPb.getInstants();
      var obtainedInstants = sams.run();
      obtainedInstants = adaptInstantsGlobalPageBuffering(obtainedInstants);

      it('#Amount of instants', function() {
        assert.equal(obtainedInstants.length, expectedInstants.length);
      });

      it.each(obtainedInstants, '#Instant %s', ['x'], function(element){
        var i = obtainedInstants.indexOf(element);
        assert.deepEqual(obtainedInstants[i]["requirement"], expectedInstants[i]["requirement"], "Requirement error");
        assert.equal(obtainedInstants[i]["pageFault"], expectedInstants[i]["pageFault"], "Page fault error");
        assert.deepEqual(obtainedInstants[i]["victim"], expectedInstants[i]["victim"], "Victim error");
        var j;
        for (j = 0; j < obtainedInstants[i]["frames"].length; j++) {
          assert.deepEqual(obtainedInstants[i]["frames"][j], expectedInstants[i]["frames"][j], "Frame " + j + " failed");
        }
        var k;
        for (k = 0; k < obtainedInstants[i]["potentialVictims"].length; k++) {
          assert.deepEqual(obtainedInstants[i]["potentialVictims"][k], expectedInstants[i]["potentialVictims"][k], "Potential victim " + k + " failed");
        }
      });
    });

    describe("Local Fixed Even", function (argument) {
      var requirements = FactoryLocalFixedEven.getRequirements();
      var sams = initializeSams(requirements, 6, false, false);
      var expectedInstants = FactoryLocalFixedEven.getInstants();
      var obtainedInstants = sams.run();
      expectedInstants = adaptExpectedInstantsLocalFixedEven(expectedInstants);
      obtainedInstants = adaptInstantsLocalFixedEven(obtainedInstants);

      it('#Amount of instants', function() {
        assert.equal(obtainedInstants.length, expectedInstants.length);
      });

      it.each(obtainedInstants, '#Instant %s', ['x'], function(element){
        var i = obtainedInstants.indexOf(element);
        assert.deepEqual(obtainedInstants[i]["requirement"], expectedInstants[i]["requirement"], "Requirement error");
        assert.equal(obtainedInstants[i]["pageFault"], expectedInstants[i]["pageFault"], "Page fault error");
        assert.deepEqual(obtainedInstants[i]["victim"], expectedInstants[i]["victim"], "Victim error");
        var j;
        for (j = 0; j < obtainedInstants[i]["frames"].length; j++) {
          assert.deepEqual(obtainedInstants[i]["frames"][j], expectedInstants[i]["frames"][j], "Frame " + j + " failed");
        }
        var k;
        for (k = 0; k < obtainedInstants[i]["potentialVictims"].length; k++) {
          assert.deepEqual(obtainedInstants[i]["potentialVictims"][k], expectedInstants[i]["potentialVictims"][k], "Potential victim " + k + " failed");
        }
      });
    });
  });



}
