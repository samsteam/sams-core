var assert = require("assert");
require('it-each')();
require('it-each')({ testPerIteration: true });

var Behavior = require('../../src/algorithms/Lru.js');

var Page = require('../../src/common/Page.js');
var Requirement = require('../../src/common/Requirement.js');
var Scheduler  = require('../../src/Scheduler');

module.exports = function() {

  describe('FIFO', function() {
    var initializeSams = function (requirements, memorySize, secondChance, asyncFlush) {
      var sams = new Scheduler();
      sams.setAlgorithm("fifo");
      sams.setSecondChanceReplacementPolicy(secondChance);
      sams.setAsyncFlushReplacementPolicy(asyncFlush);
      sams.setMemorySize(memorySize);
      sams.addRequirements(requirements);
      return sams;
    };

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
      var expectedInstants = [{
          requirement: {
            process: 'B',
            pageNumber: 2,
            mode: 'read'
          },
          frames: [
          {
            process: 'B',
            pageNumber: 2,
            referenced: false,
            modified: false,
            pageFault: true,
            reservedForAsyncFlush: false
          }
        ],
          potentialVictims: [
          {
            process: 'B',
            pageNumber: 2,
            referenced: false,
            modified: false
          }
        ],
          pageFault: true,
          victim: undefined
        }, {
          requirement: {
            process: 'B',
            pageNumber: 4,
            mode: 'read'
          },
          frames: [
          {
            process: 'B',
            pageNumber: 2,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'B',
            pageNumber: 4,
            referenced: false,
            modified: false,
            pageFault: true,
            reservedForAsyncFlush: false
          }
        ],
          potentialVictims: [
          {
            process: 'B',
            pageNumber: 2,
            referenced: false,
            modified: false
          },  {
            process: 'B',
            pageNumber: 4,
            referenced: false,
            modified: false
          }
        ],
          pageFault: true,
          victim: undefined
        }, {
          requirement: {
            process: 'A',
            pageNumber: 1,
            mode: 'read'
          },
          frames: [
          {
            process: 'B',
            pageNumber: 2,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'B',
            pageNumber: 4,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'A',
            pageNumber: 1,
            referenced: false,
            modified: false,
            pageFault: true,
            reservedForAsyncFlush: false
          }
        ],
          potentialVictims: [
          {
            process: 'B',
            pageNumber: 2,
            referenced: false,
            modified: false
          },  {
            process: 'B',
            pageNumber: 4,
            referenced: false,
            modified: false
          },  {
            process: 'A',
            pageNumber: 1,
            referenced: false,
            modified: false
          }
        ],
          pageFault: true,
          victim: undefined
        }, {
          requirement: {
            process: 'A',
            pageNumber: 3,
            mode: 'read'
          },
          frames: [
          {
            process: 'B',
            pageNumber: 2,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'B',
            pageNumber: 4,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'A',
            pageNumber: 1,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'A',
            pageNumber: 3,
            referenced: false,
            modified: false,
            pageFault: true,
            reservedForAsyncFlush: false
          }
        ],
          potentialVictims: [
          {
            process: 'B',
            pageNumber: 2,
            referenced: false,
            modified: false
          },  {
            process: 'B',
            pageNumber: 4,
            referenced: false,
            modified: false
          },  {
            process: 'A',
            pageNumber: 1,
            referenced: false,
            modified: false
          },  {
            process: 'A',
            pageNumber: 3,
            referenced: false,
            modified: false
          }
        ],
          pageFault: true,
          victim: undefined
        }, {
          requirement: {
            process: 'A',
            pageNumber: 1,
            mode: 'read'
          },
          frames: [
          {
            process: 'B',
            pageNumber: 2,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'B',
            pageNumber: 4,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'A',
            pageNumber: 1,
            referenced: true,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'A',
            pageNumber: 3,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          }
        ],
          potentialVictims: [
          {
            process: 'B',
            pageNumber: 2,
            referenced: false,
            modified: false
          },  {
            process: 'B',
            pageNumber: 4,
            referenced: false,
            modified: false
          },  {
            process: 'A',
            pageNumber: 1,
            referenced: true,
            modified: false
          },  {
            process: 'A',
            pageNumber: 3,
            referenced: false,
            modified: false
          }
        ],
          pageFault: false,
          victim: undefined
        }, {
          requirement: {
            process: 'C',
            pageNumber: 1,
            mode: 'read'
          },
          frames: [
          {
            process: 'B',
            pageNumber: 2,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'B',
            pageNumber: 4,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'A',
            pageNumber: 1,
            referenced: true,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'A',
            pageNumber: 3,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'C',
            pageNumber: 1,
            referenced: false,
            modified: false,
            pageFault: true,
            reservedForAsyncFlush: false
          }
        ],
          potentialVictims: [
          {
            process: 'B',
            pageNumber: 2,
            referenced: false,
            modified: false
          },  {
            process: 'B',
            pageNumber: 4,
            referenced: false,
            modified: false
          },  {
            process: 'A',
            pageNumber: 1,
            referenced: true,
            modified: false
          },  {
            process: 'A',
            pageNumber: 3,
            referenced: false,
            modified: false
          },  {
            process: 'C',
            pageNumber: 1,
            referenced: false,
            modified: false
          }
        ],
          pageFault: true,
          victim: undefined
        }, {
          requirement: {
            process: 'C',
            pageNumber: 2,
            mode: 'read'
          },
          frames: [
          {
            process: 'B',
            pageNumber: 2,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'B',
            pageNumber: 4,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'A',
            pageNumber: 1,
            referenced: true,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'A',
            pageNumber: 3,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'C',
            pageNumber: 1,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'C',
            pageNumber: 2,
            referenced: false,
            modified: false,
            pageFault: true,
            reservedForAsyncFlush: false
          }
        ],
          potentialVictims: [
          {
            process: 'B',
            pageNumber: 2,
            referenced: false,
            modified: false
          },  {
            process: 'B',
            pageNumber: 4,
            referenced: false,
            modified: false
          },  {
            process: 'A',
            pageNumber: 1,
            referenced: true,
            modified: false
          },  {
            process: 'A',
            pageNumber: 3,
            referenced: false,
            modified: false
          },  {
            process: 'C',
            pageNumber: 1,
            referenced: false,
            modified: false
          },  {
            process: 'C',
            pageNumber: 2,
            referenced: false,
            modified: false
          }
        ],
          pageFault: true,
          victim: undefined
        }, {
          requirement: {
            process: 'B',
            pageNumber: 6,
            mode: 'read'
          },
          frames: [
          {
            process: 'B',
            pageNumber: 2,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'B',
            pageNumber: 4,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'A',
            pageNumber: 1,
            referenced: true,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'A',
            pageNumber: 3,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'C',
            pageNumber: 1,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'C',
            pageNumber: 2,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'B',
            pageNumber: 6,
            referenced: false,
            modified: false,
            pageFault: true,
            reservedForAsyncFlush: false
          }
        ],
          potentialVictims: [
          {
            process: 'B',
            pageNumber: 2,
            referenced: false,
            modified: false
          },  {
            process: 'B',
            pageNumber: 4,
            referenced: false,
            modified: false
          },  {
            process: 'A',
            pageNumber: 1,
            referenced: true,
            modified: false
          },  {
            process: 'A',
            pageNumber: 3,
            referenced: false,
            modified: false
          },  {
            process: 'C',
            pageNumber: 1,
            referenced: false,
            modified: false
          },  {
            process: 'C',
            pageNumber: 2,
            referenced: false,
            modified: false
          },  {
            process: 'B',
            pageNumber: 6,
            referenced: false,
            modified: false
          }
        ],
          pageFault: true,
          victim: undefined
        }, {
          requirement: {
            process: 'B',
            pageNumber: 2,
            mode: 'read'
          },
          frames: [
          {
            process: 'B',
            pageNumber: 2,
            referenced: true,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'B',
            pageNumber: 4,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'A',
            pageNumber: 1,
            referenced: true,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'A',
            pageNumber: 3,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'C',
            pageNumber: 1,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'C',
            pageNumber: 2,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'B',
            pageNumber: 6,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          }
        ],
          potentialVictims: [
          {
            process: 'B',
            pageNumber: 2,
            referenced: true,
            modified: false
          },  {
            process: 'B',
            pageNumber: 4,
            referenced: false,
            modified: false
          },  {
            process: 'A',
            pageNumber: 1,
            referenced: true,
            modified: false
          },  {
            process: 'A',
            pageNumber: 3,
            referenced: false,
            modified: false
          },  {
            process: 'C',
            pageNumber: 1,
            referenced: false,
            modified: false
          },  {
            process: 'C',
            pageNumber: 2,
            referenced: false,
            modified: false
          },  {
            process: 'B',
            pageNumber: 6,
            referenced: false,
            modified: false
          }
        ],
          pageFault: false,
          victim: undefined
        }, {
          requirement: {
            process: 'B',
            pageNumber: 4,
            mode: 'read'
          },
          frames: [
          {
            process: 'B',
            pageNumber: 2,
            referenced: true,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'B',
            pageNumber: 4,
            referenced: true,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'A',
            pageNumber: 1,
            referenced: true,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'A',
            pageNumber: 3,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'C',
            pageNumber: 1,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'C',
            pageNumber: 2,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'B',
            pageNumber: 6,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          }
        ],
          potentialVictims: [
          {
            process: 'B',
            pageNumber: 2,
            referenced: true,
            modified: false
          },  {
            process: 'B',
            pageNumber: 4,
            referenced: true,
            modified: false
          },  {
            process: 'A',
            pageNumber: 1,
            referenced: true,
            modified: false
          },  {
            process: 'A',
            pageNumber: 3,
            referenced: false,
            modified: false
          },  {
            process: 'C',
            pageNumber: 1,
            referenced: false,
            modified: false
          },  {
            process: 'C',
            pageNumber: 2,
            referenced: false,
            modified: false
          },  {
            process: 'B',
            pageNumber: 6,
            referenced: false,
            modified: false
          }
        ],
          pageFault: false,
          victim: undefined
        }, {
          requirement: {
            process: 'A',
            pageNumber: 2,
            mode: 'read'
          },
          frames: [
          {
            process: 'B',
            pageNumber: 2,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'B',
            pageNumber: 4,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'A',
            pageNumber: 1,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'A',
            pageNumber: 2,
            referenced: false,
            modified: false,
            pageFault: true,
            reservedForAsyncFlush: false
          },  {
            process: 'C',
            pageNumber: 1,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'C',
            pageNumber: 2,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'B',
            pageNumber: 6,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          }
        ],
          potentialVictims: [
          {
            process: 'C',
            pageNumber: 1,
            referenced: false,
            modified: false
          },  {
            process: 'C',
            pageNumber: 2,
            referenced: false,
            modified: false
          },  {
            process: 'B',
            pageNumber: 6,
            referenced: false,
            modified: false
          },  {
            process: 'B',
            pageNumber: 2,
            referenced: false,
            modified: false
          },  {
            process: 'B',
            pageNumber: 4,
            referenced: false,
            modified: false
          },  {
            process: 'A',
            pageNumber: 1,
            referenced: false,
            modified: false
          },  {
            process: 'A',
            pageNumber: 2,
            referenced: false,
            modified: false
          }
        ],
          pageFault: true,
          victim:   {
          process: 'A',
          pageNumber: 3,
          referenced: false,
          modified: false }
        }, {
          requirement: {
            process: 'A',
            pageNumber: 4,
            mode: 'read'
          },
          frames: [
          {
            process: 'B',
            pageNumber: 2,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'B',
            pageNumber: 4,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'A',
            pageNumber: 1,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'A',
            pageNumber: 2,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'A',
            pageNumber: 4,
            referenced: false,
            modified: false,
            pageFault: true,
            reservedForAsyncFlush: false
          },  {
            process: 'C',
            pageNumber: 2,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'B',
            pageNumber: 6,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          }
        ],
          potentialVictims: [
          {
            process: 'C',
            pageNumber: 2,
            referenced: false,
            modified: false
          },  {
            process: 'B',
            pageNumber: 6,
            referenced: false,
            modified: false
          },  {
            process: 'B',
            pageNumber: 2,
            referenced: false,
            modified: false
          },  {
            process: 'B',
            pageNumber: 4,
            referenced: false,
            modified: false
          },  {
            process: 'A',
            pageNumber: 1,
            referenced: false,
            modified: false
          },  {
            process: 'A',
            pageNumber: 2,
            referenced: false,
            modified: false
          },  {
            process: 'A',
            pageNumber: 4,
            referenced: false,
            modified: false
          }
        ],
          pageFault: true,
          victim:   {
          process: 'C',
          pageNumber: 1,
          referenced: false,
          modified: false }
        }, {
          requirement: {
            process: 'A',
            pageNumber: 1,
            mode: 'read'
          },
          frames: [
          {
            process: 'B',
            pageNumber: 2,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'B',
            pageNumber: 4,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'A',
            pageNumber: 1,
            referenced: true,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'A',
            pageNumber: 2,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'A',
            pageNumber: 4,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'C',
            pageNumber: 2,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'B',
            pageNumber: 6,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          }
        ],
          potentialVictims: [
          {
            process: 'C',
            pageNumber: 2,
            referenced: false,
            modified: false
          },  {
            process: 'B',
            pageNumber: 6,
            referenced: false,
            modified: false
          },  {
            process: 'B',
            pageNumber: 2,
            referenced: false,
            modified: false
          },  {
            process: 'B',
            pageNumber: 4,
            referenced: false,
            modified: false
          },  {
            process: 'A',
            pageNumber: 1,
            referenced: true,
            modified: false
          },  {
            process: 'A',
            pageNumber: 2,
            referenced: false,
            modified: false
          },  {
            process: 'A',
            pageNumber: 4,
            referenced: false,
            modified: false
          }
        ],
          pageFault: false,
          victim: undefined
        }, {
          requirement: {
            process: 'C',
            pageNumber: 4,
            mode: 'read'
          },
          frames: [
          {
            process: 'B',
            pageNumber: 2,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'B',
            pageNumber: 4,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'A',
            pageNumber: 1,
            referenced: true,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'A',
            pageNumber: 2,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'A',
            pageNumber: 4,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'C',
            pageNumber: 4,
            referenced: false,
            modified: false,
            pageFault: true,
            reservedForAsyncFlush: false
          },  {
            process: 'B',
            pageNumber: 6,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          }
        ],
          potentialVictims: [
          {
            process: 'B',
            pageNumber: 6,
            referenced: false,
            modified: false
          },  {
            process: 'B',
            pageNumber: 2,
            referenced: false,
            modified: false
          },  {
            process: 'B',
            pageNumber: 4,
            referenced: false,
            modified: false
          },  {
            process: 'A',
            pageNumber: 1,
            referenced: true,
            modified: false
          },  {
            process: 'A',
            pageNumber: 2,
            referenced: false,
            modified: false
          },  {
            process: 'A',
            pageNumber: 4,
            referenced: false,
            modified: false
          },  {
            process: 'C',
            pageNumber: 4,
            referenced: false,
            modified: false
          }
        ],
          pageFault: true,
          victim:   {
          process: 'C',
          pageNumber: 2,
          referenced: false,
          modified: false }
        }, {
          requirement: {
            process: 'C',
            pageNumber: 8,
            mode: 'read'
          },
          frames: [
          {
            process: 'B',
            pageNumber: 2,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'B',
            pageNumber: 4,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'A',
            pageNumber: 1,
            referenced: true,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'A',
            pageNumber: 2,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'A',
            pageNumber: 4,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'C',
            pageNumber: 4,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'C',
            pageNumber: 8,
            referenced: false,
            modified: false,
            pageFault: true,
            reservedForAsyncFlush: false
          }
        ],
          potentialVictims: [
          {
            process: 'B',
            pageNumber: 2,
            referenced: false,
            modified: false
          },  {
            process: 'B',
            pageNumber: 4,
            referenced: false,
            modified: false
          },  {
            process: 'A',
            pageNumber: 1,
            referenced: true,
            modified: false
          },  {
            process: 'A',
            pageNumber: 2,
            referenced: false,
            modified: false
          },  {
            process: 'A',
            pageNumber: 4,
            referenced: false,
            modified: false
          },  {
            process: 'C',
            pageNumber: 4,
            referenced: false,
            modified: false
          },  {
            process: 'C',
            pageNumber: 8,
            referenced: false,
            modified: false
          }
        ],
          pageFault: true,
          victim:   {
          process: 'B',
          pageNumber: 6,
          referenced: false,
          modified: false }
        }, {
          requirement: {
            process: 'B',
            pageNumber: 1,
            mode: 'read'
          },
          frames: [
          {
            process: 'B',
            pageNumber: 1,
            referenced: false,
            modified: false,
            pageFault: true,
            reservedForAsyncFlush: false
          },  {
            process: 'B',
            pageNumber: 4,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'A',
            pageNumber: 1,
            referenced: true,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'A',
            pageNumber: 2,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'A',
            pageNumber: 4,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'C',
            pageNumber: 4,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'C',
            pageNumber: 8,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          }
        ],
          potentialVictims: [
          {
            process: 'B',
            pageNumber: 4,
            referenced: false,
            modified: false
          },  {
            process: 'A',
            pageNumber: 1,
            referenced: true,
            modified: false
          },  {
            process: 'A',
            pageNumber: 2,
            referenced: false,
            modified: false
          },  {
            process: 'A',
            pageNumber: 4,
            referenced: false,
            modified: false
          },  {
            process: 'C',
            pageNumber: 4,
            referenced: false,
            modified: false
          },  {
            process: 'C',
            pageNumber: 8,
            referenced: false,
            modified: false
          },  {
            process: 'B',
            pageNumber: 1,
            referenced: false,
            modified: false
          }
        ],
          pageFault: true,
          victim:   {
          process: 'B',
          pageNumber: 2,
          referenced: false,
          modified: false }
        }, {
          requirement: {
            process: 'B',
            pageNumber: 8,
            mode: 'read'
          },
          frames: [
          {
            process: 'B',
            pageNumber: 1,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'B',
            pageNumber: 8,
            referenced: false,
            modified: false,
            pageFault: true,
            reservedForAsyncFlush: false
          },  {
            process: 'A',
            pageNumber: 1,
            referenced: true,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'A',
            pageNumber: 2,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'A',
            pageNumber: 4,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'C',
            pageNumber: 4,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'C',
            pageNumber: 8,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          }
        ],
          potentialVictims: [
          {
            process: 'A',
            pageNumber: 1,
            referenced: true,
            modified: false
          },  {
            process: 'A',
            pageNumber: 2,
            referenced: false,
            modified: false
          },  {
            process: 'A',
            pageNumber: 4,
            referenced: false,
            modified: false
          },  {
            process: 'C',
            pageNumber: 4,
            referenced: false,
            modified: false
          },  {
            process: 'C',
            pageNumber: 8,
            referenced: false,
            modified: false
          },  {
            process: 'B',
            pageNumber: 1,
            referenced: false,
            modified: false
          },  {
            process: 'B',
            pageNumber: 8,
            referenced: false,
            modified: false
          }
        ],
          pageFault: true,
          victim:   {
          process: 'B',
          pageNumber: 4,
          referenced: false,
          modified: false }
        }, {
          requirement: {
            process: 'C',
            pageNumber: 6,
            mode: 'read'
          },
          frames: [
          {
            process: 'B',
            pageNumber: 1,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'B',
            pageNumber: 8,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'A',
            pageNumber: 1,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'C',
            pageNumber: 6,
            referenced: false,
            modified: false,
            pageFault: true,
            reservedForAsyncFlush: false
          },  {
            process: 'A',
            pageNumber: 4,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'C',
            pageNumber: 4,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'C',
            pageNumber: 8,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          }
        ],
          potentialVictims: [
          {
            process: 'A',
            pageNumber: 4,
            referenced: false,
            modified: false
          },  {
            process: 'C',
            pageNumber: 4,
            referenced: false,
            modified: false
          },  {
            process: 'C',
            pageNumber: 8,
            referenced: false,
            modified: false
          },  {
            process: 'B',
            pageNumber: 1,
            referenced: false,
            modified: false
          },  {
            process: 'B',
            pageNumber: 8,
            referenced: false,
            modified: false
          },  {
            process: 'A',
            pageNumber: 1,
            referenced: false,
            modified: false
          },  {
            process: 'C',
            pageNumber: 6,
            referenced: false,
            modified: false
          }
        ],
          pageFault: true,
          victim:   {
          process: 'A',
          pageNumber: 2,
          referenced: false,
          modified: false }
        }, {
          requirement: {
            process: 'C',
            pageNumber: 1,
            mode: 'read'
          },
          frames: [
          {
            process: 'B',
            pageNumber: 1,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'B',
            pageNumber: 8,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'A',
            pageNumber: 1,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'C',
            pageNumber: 6,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'C',
            pageNumber: 1,
            referenced: false,
            modified: false,
            pageFault: true,
            reservedForAsyncFlush: false
          },  {
            process: 'C',
            pageNumber: 4,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'C',
            pageNumber: 8,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          }
        ],
          potentialVictims: [
          {
            process: 'C',
            pageNumber: 4,
            referenced: false,
            modified: false
          },  {
            process: 'C',
            pageNumber: 8,
            referenced: false,
            modified: false
          },  {
            process: 'B',
            pageNumber: 1,
            referenced: false,
            modified: false
          },  {
            process: 'B',
            pageNumber: 8,
            referenced: false,
            modified: false
          },  {
            process: 'A',
            pageNumber: 1,
            referenced: false,
            modified: false
          },  {
            process: 'C',
            pageNumber: 6,
            referenced: false,
            modified: false
          },  {
            process: 'C',
            pageNumber: 1,
            referenced: false,
            modified: false
          }
        ],
          pageFault: true,
          victim:   {
          process: 'A',
          pageNumber: 4,
          referenced: false,
          modified: false }
        }, {
          requirement: {
            process: 'C',
            pageNumber: 4,
            mode: 'read'
          },
          frames: [
          {
            process: 'B',
            pageNumber: 1,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'B',
            pageNumber: 8,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'A',
            pageNumber: 1,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'C',
            pageNumber: 6,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'C',
            pageNumber: 1,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'C',
            pageNumber: 4,
            referenced: true,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'C',
            pageNumber: 8,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          }
        ],
          potentialVictims: [
          {
            process: 'C',
            pageNumber: 4,
            referenced: true,
            modified: false
          },  {
            process: 'C',
            pageNumber: 8,
            referenced: false,
            modified: false
          },  {
            process: 'B',
            pageNumber: 1,
            referenced: false,
            modified: false
          },  {
            process: 'B',
            pageNumber: 8,
            referenced: false,
            modified: false
          },  {
            process: 'A',
            pageNumber: 1,
            referenced: false,
            modified: false
          },  {
            process: 'C',
            pageNumber: 6,
            referenced: false,
            modified: false
          },  {
            process: 'C',
            pageNumber: 1,
            referenced: false,
            modified: false
          }
        ],
          pageFault: false,
          victim: undefined
        }, {
          requirement: {
            process: 'C',
            pageNumber: 1,
            mode: 'read'
          },
          frames: [
          {
            process: 'B',
            pageNumber: 1,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'B',
            pageNumber: 8,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'A',
            pageNumber: 1,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'C',
            pageNumber: 6,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'C',
            pageNumber: 1,
            referenced: true,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'C',
            pageNumber: 4,
            referenced: true,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'C',
            pageNumber: 8,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          }
        ],
          potentialVictims: [
          {
            process: 'C',
            pageNumber: 4,
            referenced: true,
            modified: false
          },  {
            process: 'C',
            pageNumber: 8,
            referenced: false,
            modified: false
          },  {
            process: 'B',
            pageNumber: 1,
            referenced: false,
            modified: false
          },  {
            process: 'B',
            pageNumber: 8,
            referenced: false,
            modified: false
          },  {
            process: 'A',
            pageNumber: 1,
            referenced: false,
            modified: false
          },  {
            process: 'C',
            pageNumber: 6,
            referenced: false,
            modified: false
          },  {
            process: 'C',
            pageNumber: 1,
            referenced: true,
            modified: false
          }
        ],
          pageFault: false,
          victim: undefined
        }, {
          requirement: {
            process: 'A',
            pageNumber: 5,
            mode: 'read'
          },
          frames: [
          {
            process: 'B',
            pageNumber: 1,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'B',
            pageNumber: 8,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'A',
            pageNumber: 1,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'C',
            pageNumber: 6,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'C',
            pageNumber: 1,
            referenced: true,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'C',
            pageNumber: 4,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'A',
            pageNumber: 5,
            referenced: false,
            modified: false,
            pageFault: true,
            reservedForAsyncFlush: false
          }
        ],
          potentialVictims: [
          {
            process: 'B',
            pageNumber: 1,
            referenced: false,
            modified: false
          },  {
            process: 'B',
            pageNumber: 8,
            referenced: false,
            modified: false
          },  {
            process: 'A',
            pageNumber: 1,
            referenced: false,
            modified: false
          },  {
            process: 'C',
            pageNumber: 6,
            referenced: false,
            modified: false
          },  {
            process: 'C',
            pageNumber: 1,
            referenced: true,
            modified: false
          },  {
            process: 'C',
            pageNumber: 4,
            referenced: false,
            modified: false
          },  {
            process: 'A',
            pageNumber: 5,
            referenced: false,
            modified: false
          }
        ],
          pageFault: true,
          victim:   {
          process: 'C',
          pageNumber: 8,
          referenced: false,
          modified: false }
        }, {
          requirement: {
            process: 'A',
            pageNumber: 1,
            mode: 'read'
          },
          frames: [
          {
            process: 'B',
            pageNumber: 1,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'B',
            pageNumber: 8,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'A',
            pageNumber: 1,
            referenced: true,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'C',
            pageNumber: 6,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'C',
            pageNumber: 1,
            referenced: true,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'C',
            pageNumber: 4,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'A',
            pageNumber: 5,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          }
        ],
          potentialVictims: [
          {
            process: 'B',
            pageNumber: 1,
            referenced: false,
            modified: false
          },  {
            process: 'B',
            pageNumber: 8,
            referenced: false,
            modified: false
          },  {
            process: 'A',
            pageNumber: 1,
            referenced: true,
            modified: false
          },  {
            process: 'C',
            pageNumber: 6,
            referenced: false,
            modified: false
          },  {
            process: 'C',
            pageNumber: 1,
            referenced: true,
            modified: false
          },  {
            process: 'C',
            pageNumber: 4,
            referenced: false,
            modified: false
          },  {
            process: 'A',
            pageNumber: 5,
            referenced: false,
            modified: false
          }
        ],
          pageFault: false,
          victim: undefined
        }, {
          requirement: {
            process: 'A',
            pageNumber: 4,
            mode: 'read'
          },
          frames: [
          {
            process: 'A',
            pageNumber: 4,
            referenced: false,
            modified: false,
            pageFault: true,
            reservedForAsyncFlush: false
          },  {
            process: 'B',
            pageNumber: 8,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'A',
            pageNumber: 1,
            referenced: true,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'C',
            pageNumber: 6,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'C',
            pageNumber: 1,
            referenced: true,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'C',
            pageNumber: 4,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'A',
            pageNumber: 5,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          }
        ],
          potentialVictims: [
          {
            process: 'B',
            pageNumber: 8,
            referenced: false,
            modified: false
          },  {
            process: 'A',
            pageNumber: 1,
            referenced: true,
            modified: false
          },  {
            process: 'C',
            pageNumber: 6,
            referenced: false,
            modified: false
          },  {
            process: 'C',
            pageNumber: 1,
            referenced: true,
            modified: false
          },  {
            process: 'C',
            pageNumber: 4,
            referenced: false,
            modified: false
          },  {
            process: 'A',
            pageNumber: 5,
            referenced: false,
            modified: false
          },  {
            process: 'A',
            pageNumber: 4,
            referenced: false,
            modified: false
          }
        ],
          pageFault: true,
          victim:   {
          process: 'B',
          pageNumber: 1,
          referenced: false,
          modified: false }
        }, {
          requirement: {
            process: 'B',
            pageNumber: 3,
            mode: 'read'
          },
          frames: [
          {
            process: 'A',
            pageNumber: 4,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'B',
            pageNumber: 3,
            referenced: false,
            modified: false,
            pageFault: true,
            reservedForAsyncFlush: false
          },  {
            process: 'A',
            pageNumber: 1,
            referenced: true,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'C',
            pageNumber: 6,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'C',
            pageNumber: 1,
            referenced: true,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'C',
            pageNumber: 4,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'A',
            pageNumber: 5,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          }
        ],
          potentialVictims: [
          {
            process: 'A',
            pageNumber: 1,
            referenced: true,
            modified: false
          },  {
            process: 'C',
            pageNumber: 6,
            referenced: false,
            modified: false
          },  {
            process: 'C',
            pageNumber: 1,
            referenced: true,
            modified: false
          },  {
            process: 'C',
            pageNumber: 4,
            referenced: false,
            modified: false
          },  {
            process: 'A',
            pageNumber: 5,
            referenced: false,
            modified: false
          },  {
            process: 'A',
            pageNumber: 4,
            referenced: false,
            modified: false
          },  {
            process: 'B',
            pageNumber: 3,
            referenced: false,
            modified: false
          }
        ],
          pageFault: true,
          victim:   {
          process: 'B',
          pageNumber: 8,
          referenced: false,
          modified: false }
        }, {
          requirement: {
            process: 'B',
            pageNumber: 1,
            mode: 'read'
          },
          frames: [
          {
            process: 'A',
            pageNumber: 4,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'B',
            pageNumber: 3,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'A',
            pageNumber: 1,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'B',
            pageNumber: 1,
            referenced: false,
            modified: false,
            pageFault: true,
            reservedForAsyncFlush: false
          },  {
            process: 'C',
            pageNumber: 1,
            referenced: true,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'C',
            pageNumber: 4,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'A',
            pageNumber: 5,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          }
        ],
          potentialVictims: [
          {
            process: 'C',
            pageNumber: 1,
            referenced: true,
            modified: false
          },  {
            process: 'C',
            pageNumber: 4,
            referenced: false,
            modified: false
          },  {
            process: 'A',
            pageNumber: 5,
            referenced: false,
            modified: false
          },  {
            process: 'A',
            pageNumber: 4,
            referenced: false,
            modified: false
          },  {
            process: 'B',
            pageNumber: 3,
            referenced: false,
            modified: false
          },  {
            process: 'A',
            pageNumber: 1,
            referenced: false,
            modified: false
          },  {
            process: 'B',
            pageNumber: 1,
            referenced: false,
            modified: false
          }
        ],
          pageFault: true,
          victim:   {
          process: 'C',
          pageNumber: 6,
          referenced: false,
          modified: false }
        }, {
          requirement: {
            process: 'B',
            pageNumber: 8,
            mode: 'read'
          },
          frames: [
          {
            process: 'A',
            pageNumber: 4,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'B',
            pageNumber: 3,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'A',
            pageNumber: 1,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'B',
            pageNumber: 1,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'C',
            pageNumber: 1,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'B',
            pageNumber: 8,
            referenced: false,
            modified: false,
            pageFault: true,
            reservedForAsyncFlush: false
          },  {
            process: 'A',
            pageNumber: 5,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          }
        ],
          potentialVictims: [
          {
            process: 'A',
            pageNumber: 5,
            referenced: false,
            modified: false
          },  {
            process: 'A',
            pageNumber: 4,
            referenced: false,
            modified: false
          },  {
            process: 'B',
            pageNumber: 3,
            referenced: false,
            modified: false
          },  {
            process: 'A',
            pageNumber: 1,
            referenced: false,
            modified: false
          },  {
            process: 'B',
            pageNumber: 1,
            referenced: false,
            modified: false
          },  {
            process: 'C',
            pageNumber: 1,
            referenced: false,
            modified: false
          },  {
            process: 'B',
            pageNumber: 8,
            referenced: false,
            modified: false
          }
        ],
          pageFault: true,
          victim:   {
          process: 'C',
          pageNumber: 4,
          referenced: false,
          modified: false }
        }, {
          requirement: {
            process: 'C',
            pageNumber: 0,
            mode: 'finish'
          },
          frames: [
          {
            process: 'A',
            pageNumber: 4,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'B',
            pageNumber: 3,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'A',
            pageNumber: 1,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'B',
            pageNumber: 1,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: '',
            pageNumber: 0,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'B',
            pageNumber: 8,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'A',
            pageNumber: 5,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          }
        ],
          potentialVictims: [
          {
            process: 'A',
            pageNumber: 5,
            referenced: false,
            modified: false
          },  {
            process: 'A',
            pageNumber: 4,
            referenced: false,
            modified: false
          },  {
            process: 'B',
            pageNumber: 3,
            referenced: false,
            modified: false
          },  {
            process: 'A',
            pageNumber: 1,
            referenced: false,
            modified: false
          },  {
            process: 'B',
            pageNumber: 1,
            referenced: false,
            modified: false
          },  {
            process: 'B',
            pageNumber: 8,
            referenced: false,
            modified: false
          }
        ],
          pageFault: false,
          victim: undefined
        }, {
          requirement: {
            process: 'A',
            pageNumber: 7,
            mode: 'read'
          },
          frames: [
          {
            process: 'A',
            pageNumber: 4,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'B',
            pageNumber: 3,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'A',
            pageNumber: 1,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'B',
            pageNumber: 1,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'A',
            pageNumber: 7,
            referenced: false,
            modified: false,
            pageFault: true,
            reservedForAsyncFlush: false
          },  {
            process: 'B',
            pageNumber: 8,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'A',
            pageNumber: 5,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          }
        ],
          potentialVictims: [
          {
            process: 'A',
            pageNumber: 5,
            referenced: false,
            modified: false
          },  {
            process: 'A',
            pageNumber: 4,
            referenced: false,
            modified: false
          },  {
            process: 'B',
            pageNumber: 3,
            referenced: false,
            modified: false
          },  {
            process: 'A',
            pageNumber: 1,
            referenced: false,
            modified: false
          },  {
            process: 'B',
            pageNumber: 1,
            referenced: false,
            modified: false
          },  {
            process: 'B',
            pageNumber: 8,
            referenced: false,
            modified: false
          },  {
            process: 'A',
            pageNumber: 7,
            referenced: false,
            modified: false
          }
        ],
          pageFault: true,
          victim: undefined
        }, {
          requirement: {
            process: 'A',
            pageNumber: 9,
            mode: 'read'
          },
          frames: [
          {
            process: 'A',
            pageNumber: 4,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'B',
            pageNumber: 3,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'A',
            pageNumber: 1,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'B',
            pageNumber: 1,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'A',
            pageNumber: 7,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'B',
            pageNumber: 8,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'A',
            pageNumber: 9,
            referenced: false,
            modified: false,
            pageFault: true,
            reservedForAsyncFlush: false
          }
        ],
          potentialVictims: [
          {
            process: 'A',
            pageNumber: 4,
            referenced: false,
            modified: false
          },  {
            process: 'B',
            pageNumber: 3,
            referenced: false,
            modified: false
          },  {
            process: 'A',
            pageNumber: 1,
            referenced: false,
            modified: false
          },  {
            process: 'B',
            pageNumber: 1,
            referenced: false,
            modified: false
          },  {
            process: 'B',
            pageNumber: 8,
            referenced: false,
            modified: false
          },  {
            process: 'A',
            pageNumber: 7,
            referenced: false,
            modified: false
          },  {
            process: 'A',
            pageNumber: 9,
            referenced: false,
            modified: false
          }
        ],
          pageFault: true,
          victim:   {
          process: 'A',
          pageNumber: 5,
          referenced: false,
          modified: false }
        }, {
          requirement: {
            process: 'A',
            pageNumber: 4,
            mode: 'read'
          },
          frames: [
          {
            process: 'A',
            pageNumber: 4,
            referenced: true,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'B',
            pageNumber: 3,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'A',
            pageNumber: 1,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'B',
            pageNumber: 1,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'A',
            pageNumber: 7,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'B',
            pageNumber: 8,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'A',
            pageNumber: 9,
            referenced: false,
            modified: false,
            pageFault: true,
            reservedForAsyncFlush: false
          }
        ],
          potentialVictims: [
          {
            process: 'A',
            pageNumber: 4,
            referenced: true,
            modified: false
          },  {
            process: 'B',
            pageNumber: 3,
            referenced: false,
            modified: false
          },  {
            process: 'A',
            pageNumber: 1,
            referenced: false,
            modified: false
          },  {
            process: 'B',
            pageNumber: 1,
            referenced: false,
            modified: false
          },  {
            process: 'B',
            pageNumber: 8,
            referenced: false,
            modified: false
          },  {
            process: 'A',
            pageNumber: 7,
            referenced: false,
            modified: false
          },  {
            process: 'A',
            pageNumber: 9,
            referenced: false,
            modified: false
          }
        ],
          pageFault: false,
          victim: undefined
        }, {
          requirement: {
            process: 'B',
            pageNumber: 0,
            mode: 'finish'
          },
          frames: [
          {
            process: 'A',
            pageNumber: 4,
            referenced: true,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: '',
            pageNumber: 0,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'A',
            pageNumber: 1,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: '',
            pageNumber: 0,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'A',
            pageNumber: 7,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: '',
            pageNumber: 0,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: 'A',
            pageNumber: 9,
            referenced: false,
            modified: false,
            pageFault: true,
            reservedForAsyncFlush: false
          }
        ],
          potentialVictims: [
          {
            process: 'A',
            pageNumber: 4,
            referenced: true,
            modified: false
          },  {
            process: 'A',
            pageNumber: 1,
            referenced: false,
            modified: false
          },  {
            process: 'A',
            pageNumber: 7,
            referenced: false,
            modified: false
          },  {
            process: 'A',
            pageNumber: 9,
            referenced: false,
            modified: false
          }
        ],
          pageFault: false,
          victim: undefined
        }, {
          requirement: {
            process: 'A',
            pageNumber: 0,
            mode: 'finish'
          },
          frames: [
          {
            process: '',
            pageNumber: 0,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: '',
            pageNumber: 0,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: '',
            pageNumber: 0,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: '',
            pageNumber: 0,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: '',
            pageNumber: 0,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: '',
            pageNumber: 0,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          },  {
            process: '',
            pageNumber: 0,
            referenced: false,
            modified: false,
            pageFault: false,
            reservedForAsyncFlush: false
          }
        ],
          potentialVictims: [

        ],
          pageFault: false,
          victim: undefined
        }];
      var obtainedInstants = sams.run();
      it('#Amount of instants', function() {
        assert.equal(expectedInstants.length, obtainedInstants.length);
      });

      // it.each(expectedInstants, '#Instant %s', ['x'], function(element){
      //   var index = expectedInstants.indexOf(element);
      //   assert.deepEqual(element, obtainedInstants[index]);
      // });

      it.each(obtainedInstants, '#Instant %s', ['x'], function(element){
        var index = obtainedInstants.indexOf(element);
        assert.deepEqual(element, expectedInstants[index]);
      });

      // for (i = 0; i < expectedInstants.length; i++) {
      //   it('#Instant ' + i, function() {
      //     assert.deepEqual(expectedInstants[i], obtainedInstants[i]);
      //     console.log(i);
      //   });
      // }

    });
  });

}
