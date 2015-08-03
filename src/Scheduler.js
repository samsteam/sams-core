var cocktail = require('cocktail');
var Logger = require('./annotations/Logger');
var Fifo = require('./algorithms/Fifo');
var Lru = require('./algorithms/Lru');
var Memory = require('./common/Memory');
var Requirement = require('./common/Requirement');
var AsyncFlushAssignmentPolicy = require('./assignment_filters/AsyncFlushAssignmentPolicy');
cocktail.use(Logger);

cocktail.mix({
  '@exports' : module,
  '@as' : 'class',

  '@logger' : [console, "Scheduler:"],

  constructor: function() {
    this._memory = undefined;
    this._memorySize = 0;
    this._moments = [];
    this._algorithm = undefined;
    this._requirements = [];
    this._assignmentPolicies = [];
    this.log("Created.");
  },
  getAlgorithm: function() {
  	return this._algorithm;
  },
  getMemorySize: function() {
  	return this._memorySize;
  },
  getAssignmentPolicies: function() {
  	return this._assignmentPolicies;
  },
  getRequirements: function() {
  	return this._requirements;
  },
  setAlgorithm: function(algorithm) {
    if (!algorithm) {
      return;
    }
    switch (algorithm) {
      case 'fifo':
        this.clearPolicies();
        this._algorithm = new Fifo();
        break;
      case 'lru':
        this.clearPolicies();
        this._algorithm = new Lru();
        break;
      default:
        return;
    }
  },

  // to be uncommented when FixedEven is implemented
  setFixedEvenAssignmentPolicy: function(enabled) {
    // if (enabled === undefined) {
    //   return;
    // }
    // if (enabled) {
    //   this._assignmentPolicies[0] = new FixedEven();
    // } else {
    //   this._assignmentPolicies[0] = undefined;
    // }
  },

  setLocalReplacementPolicy: function(enabled) {
    if (enabled === undefined) {
      return;
    }
    if (this._algorithm) {
      this._algorithm.setLocalReplacementPolicy(enabled);
    }
  },

  setAsyncFlushReplacementPolicy: function(enabled) {
    if (enabled === undefined) {
      return;
    }
    if (this._algorithm && enabled) {
      var policy = new AsyncFlushAssignmentPolicy()
      this._assignmentPolicies[1] = policy;
      this._algorithm.setAsyncFlushReplacementPolicy(true, policy);
    } else {
      delete this._assignmentPolicies[1];
      this._algorithm.setAsyncFlushReplacementPolicy(false);
    }
	},

  setSecondChanceReplacementPolicy: function(enabled) {
    if (enabled === undefined) {
      return;
    }
    if (this._algorithm) {
      this._algorithm.setSecondChanceReplacementPolicy(enabled);
    }
  },

  clearPolicies: function() {
    this._assignmentPolicies = [];
    if (this._algorithm) {
      this._algorithm.clearPolicies();
    }
    this.log("All policies cleared.")
  },

  setMemorySize: function(size) {
    if (!size) {
      return;
    }
    this._memory = new Memory(size);
    this._memorySize = size;
    this._updatePolicies();
  },

  addRequirements: function(requirements) {
    if (!requirements) {
      return;
    }
    this.log("---Started generating the requirements queue.---");
    requirements.forEach(function(elem) {
      this._requirements.push(new Requirement(elem));
    }, this);
    this.log("---Finished generating the requirements queue.---\n");
  },

  run: function() {
    if (!this._memory || !this._algorithm || !this._requirements.length) {
      throw new Error("Some initialization is missing!!");
    }
    this._algorithm.initialize(this._requirements);
    this._processRequirements();
    /*
     *  _processRequirements will save all data in _moments.
     *  We'll need to parse it before sending it back to the client.
     */
    var allMoments = this._dataMoments();

    //Dispose all arrays.
    this._clearBuffers();

    return allMoments;
  },

  _dataMoments: function() {
    this.log("---Started generating the output matrix.---");
    var allMoments = [];

    //Here we use the context to bind the array in which i want the pages to be added.
    this._moments.forEach(function(memory) {
      var singleMoment = [];

      //Here too (it's a matrix).
      memory.forEach(function(page) {
        this.push(page.asDataObject());
      }, singleMoment);

      this.push(singleMoment);

    }, allMoments);

    this.log("---Finished generating the output matrix.---\n");
    return allMoments;
  },

  _clearBuffers: function(arguments) {
    if (this._memorySize) {
      this._memory = new Memory(this._memorySize);
    }
    this._moments = [];
    this._requirements = [];
    this.log("All buffers cleared.");
  },

  //  To be implemented with FixedEven assignment filter.
  _assignmentFiltersAproves: function(requirement) {
    var hasSpace = !this._memory.isFull();

    var i = 0;
		var length = this._assignmentPolicies.length;
		for (; i < length; i++) {
			if (this._assignmentPolicies[i]) {
				hasSpace &= this._assignmentPolicies[i].hasFreeFrameFor(requirement, this._memory, this);
			}
		}
    return hasSpace;
  },

  _update: function(requirement) {
    this._algorithm.update(requirement);
    this._updateMemory(requirement);
    this._updatePolicies();
  },

  _updateMemory: function(requirement) {
    //  Assume that the requirement is already in memory.
    var page = this._memory.at(this._memory.getFrameOf(requirement));
    page.setReferenced(true);
    if (requirement.getMode() === "write") {
      page.setModified(true);
    }
  },

  _updatePolicies: function() {
    this._assignmentPolicies.forEach(function(policy) {
      policy.update(this._memory, this)
    }, this);
  },

  _saveMemory: function() {
    this.log("Saving moment " + this._moments.length + ".");
    this._moments.push(this._memory.clone());
    this.log("Moment " + (this._moments.length -1) + " saved.\n");
  },

  _clearMemoryFlags: function() {
    this._memory.forEach(function(page) {
      page.clearPageFault();
      page.clearReferenced();
    });
    this.log("All page flags cleared.");
  },

  _processRequirements: function() {
    this._requirements.forEach(function(requirement) {
      //  Start with a clean image of the frames.
      this._clearMemoryFlags();

      if (this._memory.contains(requirement)) {
        this.log("---Memory hit! Updating reference.---\n")
      } else {
        /*
         *  This is a pageFault.
         *  Steps to follow:
         *  1) Ask to the assignment policy if the requirement
         *  needs to replace a page.
         *  2a) No need to replace. Ask the memory for a free frame to use.
         *  2b) We need to replace. Ask the algorithm for the page to replace,
         *      then find it in the memory.
         *  3) Load the requirement to the memory as a page.
         */
         this.log("---Page Fault.---");
         var frame;
         if(this._assignmentFiltersAproves(requirement)) {
            this.log("---Free frame available.---\n");
            frame = this._memory.getFreeFrame();
         } else {
           this.log("---Searching for a victim muajajaja!---\n");
           var victim = this._algorithm.victimFor(requirement);
           frame = this._memory.getFrameOf(victim);
         }
         this._memory.atPut(frame, requirement.asPage());
      }
      //  Even if it's a page fault or not, call to update.
      this._update(requirement);
      this._saveMemory();
    }, this);
  }
});
