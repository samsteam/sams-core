var cocktail = require('cocktail');
var Logger = require('../annotations/Logger');
var AlgorithmInterface = require('./AlgorithmInterface');
var LocalReplacementPolicy = require('../filters/replacement_filters/LocalReplacementPolicy');
var Queue = require('../common/VictimsStructures/Queue');

cocktail.use(Logger);

cocktail.mix({
	'@exports': module,
	'@as': 'class',
	'@traits': [AlgorithmInterface],
	'@logger' : [console, "Algorithm Base:"],

	constructor: function() {
		this._victims = undefined;
		this._finalized = new Queue();
		this._requirements = [];
		this._filters = [];
	},

	initialize: function(requirements) {
	  this._requirements = requirements;
		this._finalized = new Queue();
	},

	getVictimsStructure: function() {
	  return this._victims;
	},

	victimFor: function(requirement) {

		//If some process has finalized, use it's frames.
		if (this._finalized.size() !== 0) {
			this.log("---Seems like I have some finished processes.---");
			var result = {};
			result.frame = this._finalized.first();
			result.page = result.frame;
			this._victims.remove(result.frame);
			this.log("The selected victim is: " + result.frame + " from a finished process.\n");
			return result;
		}

		//Else search for a victim.
		this.log("---Started applying replacement filters.---");
		var filteredVictims = this._victims.clone();

		var i = 0;
		var length = this._filters.length;
		for (; i < length; i++) {
			if (this._filters[i]) {
				this._filters[i].apply(filteredVictims, requirement, this);
			}
		}
		this.log("Finished applying replacement filters.---\n");
		this.log("The selected victim is: " + filteredVictims.peek() + ".\n");
		this._victims.remove(filteredVictims.peek());

		var position = filteredVictims.first();
		var victim = position;
		if (position.isReservedForPageBuffering()) {
			victim = this._filters[1]._memory.at(this._filters[1]._position);
		}

		var result = {
			frame: position,
			page: victim
		}

		return result;
	},

	addPage: function(requirement) {
	  throw new Error("Subclass responsibility.")
	},

	getPage: function(requirement) {
	  throw new Error("Subclass responsibility.")
	},

	update: function(requirement) {
		if (requirement.getMode() === "finish") {

			var context = {
				requirement: requirement,
				finalized: this._finalized
			};

			this.log("Adding all the frames of process " + requirement.getProcess() + " to the finalized Queue.")
			this._victims.forEach(function(page, index, victims) {
			  if (this.requirement.getProcess() === page.getProcess()) {
					victims.pageOf(page).setFinished(true);
			  	this.finalized.add(page.clone());
			  }
			}, context);

			return;
		}
	},

	recycle: function(requirement) {
	  throw new Error("Subclass responsibility.")
	},

	setLocalReplacementPolicy: function(enabled) {
		if (enabled) {
	  	this._filters[0] = new LocalReplacementPolicy();
		} else {
			delete this._filters[0];
		}
	},

	setPageBufferingFilter: function(enabled, filter) {
		if (enabled) {
	  	this._filters[1] = filter;
		} else {
			delete this._filters[1];
		}
	},

	setSecondChanceFilter: function(enabled, filter) {
		if (enabled) {
	  	this._filters[2] = filter;
		} else {
			delete this._filters[2];
		}
	},

	isLocalReplacementPolicy: function() {
	  return this._filters[0] !== undefined;
	},

	isPageBuffering: function() {
	  return this._filters[1] !== undefined;
	},

	isSecondChance: function() {
	  return this._filters[2] !== undefined;
	},

	clearPolicies: function() {
	  this._filters = [];
	}
});
