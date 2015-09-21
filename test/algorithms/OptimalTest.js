var assert = require("assert");
require('it-each')();
require('it-each')({ testPerIteration: true });

var Page = require('../../src/common/Page.js');
var Requirement = require('../../src/common/Requirement.js');
var Scheduler  = require('../../src/Scheduler');
var FactoryOptimalGlobalDynamic = require('./helpers/resultFactories/optimalGlobalDynamic')

module.exports = function() {

  describe('Optimal', function() {
    var initializeSams = function (requirements, memorySize, pageBuffering) {
      var sams = new Scheduler();
      sams.setAlgorithm("optimal");
      sams.setPageBufferingFilter(pageBuffering);
      sams.setMemorySize(memorySize);
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

    var adaptInstantsGlobalDynamic = function (instants) {
      var i;
      for (i = 0; i < instants.length; i++) {
        deleteFinishedAttributeFromInstant(instants[i]);
        deleteReferencedAttributeFromInstant(instants[i]);
        cleanNonUsedFrames(instants[i]["frames"]);
      }
      return instants;
    }

    var adaptInstantsGlobalDynamicPageBuffering = function (instants) {
      var i;
      for (i = 0; i < instants.length; i++) {
        deleteFinishedAttributeFromInstant(instants[i]);
        deleteReferencedAttributeFromInstant(instants[i]);
        cleanNonUsedFrames(instants[i]["frames"]);
      }
      return instants;
    }

    describe('Global Dynamic', function() {
      var requirements = FactoryOptimalGlobalDynamic.getRequirements();
      var sams = initializeSams(requirements, 7, false, true);
      var expectedInstants = FactoryOptimalGlobalDynamic.getInstants();
      var obtainedInstants = sams.run();
      obtainedInstants = adaptInstantsGlobalDynamic(obtainedInstants);

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
