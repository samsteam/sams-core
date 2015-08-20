var cocktail = require('cocktail');
var Logger = require('../annotations/Logger');
var AlgorithmInterface = require('./AlgorithmInterface');
var LocalReplacementPolicy = require('../filters/replacement_filters/LocalReplacementPolicy');

cocktail.use(Logger);

cocktail.mix({
	'@exports': module,
	'@as': 'class',
	'@traits': [AlgorithmInterface],
	'@logger' : [console, "Algorithm Base:"],

	constructor: function() {
		//Should be initialized by some especification of this class.
		this._victims = undefined;
		this._requirements = undefined;
		this._filters = [];
	},

	getVictimsStructure: function() {
	  return this._victims;
	},

	initialize: function(requirements) {
	  this._requirements = requirements;
	},

	victimFor: function(requirement) {

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
	  throw new Error("Subclass responsibility.")
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
