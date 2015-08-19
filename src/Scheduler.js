var cocktail = require('cocktail');
var Logger = require('./annotations/Logger');
var Fifo = require('./algorithms/Fifo');
var Lru = require('./algorithms/Lru');
var Memory = require('./common/Memory');
var Requirement = require('./common/Requirement');
var FixedEvenAssignmentPolicy = require('./assignment_filters/FixedEvenAssignmentPolicy');
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
    this._rawRequirements = [];
    this._requirements = [];
    this._assignmentPolicies = [];
    this.log("Created.");
  },

  getAlgorithm: function() {
    if ( this._algorithm !== undefined ) {

      if (this._algorithm instanceof Lru)
          return 'lru';

      if (this._algorithm instanceof Fifo)
        return 'fifo';
    }

    return undefined;
  },

  getMemorySize: function() {
  	return this._memorySize;
  },

  getRequirements: function() {
  	return this._rawRequirements;
  },

  isFixedEvenAssignmentPolicy: function() {
    return this._assignmentPolicies[0] !== undefined;
  },
  isLocalReplacementPolicy: function() {
    if (this._algorithm){
      return this._algorithm.isLocalReplacementPolicy();
    } else {
      return undefined;
    }
  },

  isAsyncFlushPolicy: function() {
    return this._assignmentPolicies[1] !== undefined;
  },

  getSecondChanceReplacementPolicy: function() {
    return this._algorithm.isSecondChanceReplacementPolicy();
  },

  isSecondChanceReplacementPolicy: function() {
    if (this._algorithm){
      return this._algorithm.isSecondChanceReplacementPolicy();
    } else {
      return undefined;
    }
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

  setFixedEvenAssignmentPolicy: function(size) {
    if (size === undefined) {
      return;
    }
    if (size) {
      this._assignmentPolicies[0] = new FixedEvenAssignmentPolicy(size);
    } else {
      delete this._assignmentPolicies[0];
    }
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

  _clearBuffers: function(arguments) {
    if (this._memorySize) {
      this._memory = new Memory(this._memorySize);
    }
    this._moments = [];
    this._resetPolicies();
    this.log("All buffers cleared.");
  },

  _resetPolicies: function() {
    if (this.isFixedEvenAssignmentPolicy()) {
      this.setFixedEvenAssignmentPolicy(this._assignmentPolicies[0].localSize());
    }
    if (this.isLocalReplacementPolicy()) {
      this.setLocalReplacementPolicy(true);
    }
    if (this.isAsyncFlushPolicy()) {
      this.setAsyncFlushReplacementPolicy(true);
    }
    if (this.isSecondChanceReplacementPolicy()) {
      this.setSecondChanceReplacementPolicy(true);
    }
  },

  setMemorySize: function(size) {
    if (!size) {
      return;
    }
    this._memory = new Memory(size);
    this._memorySize = size;
    // this._resetPolicies();
    this._updatePolicies();
  },

  addRequirements: function(requirements) {
    if (!requirements) {
      return;
    }
    this._rawRequirements = requirements;
    this._requirements = [];
    this.log("---Started generating the requirements queue.---");
    this._rawRequirements.forEach(function(elem) {
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
    this._moments.forEach(function(moment) {
      var singleMoment = {
        requirement: moment.requirement,
        pageFault: moment.pageFault,
        frames: moment.instant,
        victim: moment.victim,
        potentialVictims: moment.potentialVictims
      }

      this.push(singleMoment);

    }, allMoments);

    this.log("---Finished generating the output matrix.---\n");
    return allMoments;
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

  _saveMoment: function(requirement, pageFault, victim) {
    this.log("Saving moment " + this._moments.length + ".");
    var moment = {
      requirement: requirement.asDataObject(),
      instant: [],
      pageFault: pageFault,
      victim: victim? victim.asVictim(): undefined,
      potentialVictims: []
    };

    this._memory.forEach(function(frame) {
      this.push(frame.asDataObject());
    }, moment.instant);

    this._algorithm.getVictimsStructure().forEach(function(potentialVictim) {
      this.push(potentialVictim.asVictim());
    }, moment.potentialVictims);

    this._moments.push(moment);
    this.log("Moment " + (this._moments.length -1) + " saved.\n");
  },

  _update: function(requirement, pageFault, victim) {
    this._algorithm.update(requirement);
    this._updateMemory(requirement, pageFault);
    this._updatePolicies();
  },

  _updateMemory: function(requirement, pageFault) {
    //  Assume that the requirement is already in memory.
    var page = this._memory.at(this._memory.getFrameOf(requirement));

    page.setRequired(true);

    if (requirement.getMode() === "write") {
      page.setModified(true);
    }

    if (!pageFault) {
      page.setReferenced(true);
    } else {
      page.setPageFault(true);
    }
  },

  _updatePolicies: function() {
    this._assignmentPolicies.forEach(function(policy) {
      policy.update(this._memory, this)
    }, this);
  },

  _clearTemporalFlags: function() {
    this._memory.forEach(function(page) {
      page.clearRequired();
      page.clearPageFault();
    }, this);
    this.log("Temporal page flags cleared.");
  },

  _processRequirements: function() {
    this._requirements.forEach(function(requirement) {
      //  Start with a clean image of the frames.
      this._clearTemporalFlags();
      //Declare victim here because it'll be used for update.
      var victim = {
        frame: undefined,
        page: undefined
      };
      var pageFault = false;

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
         pageFault = true;
         var frame;
         if(this._assignmentFiltersAproves(requirement)) {
            this.log("---Free frame available.---\n");
            frame = this._memory.getFreeFrame();
         } else {
           this.log("---Searching for a victim muajajaja!---\n");
           victim = this._algorithm.victimFor(requirement);
           frame = this._memory.getFrameOf(victim.frame);
         }
         this._memory.atPut(frame, requirement.asPage());
      }
      this._update(requirement, pageFault, victim.page);
      this._saveMoment(requirement, pageFault, victim.page);
    }, this);
  }
});
