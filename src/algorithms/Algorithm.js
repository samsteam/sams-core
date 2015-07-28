var cocktail = require('cocktail');
var Logger = require('../annotations/Logger');
var AlgorithmInterface = require('./AlgorithmInterface');

cocktail.use(Logger);

cocktail.mix({
	'@exports': module,
	'@as': 'class',
	'@traits': [AlgorithmInterface],
	'@logger' : [console, "Algorithm Base:"],

	constructor: function() {
		//Should be initialized by some especification of this class.
		this._victims = undefined;

		this._filters = [];
	},

	victimFor: function(requirement) {
		var filteredVictims = this._victims.clone();

		var i = 0;
		var length = this._filters.length;
		for (; i < length; i++) {
			this._filters[i].apply(filteredVictims, requirement, this);
		}
		//Call to the child.
		this.addPage(requirement);

		return filteredVictims.first();
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

	clearPolicies: function() {
	  this._filters = [];
	}
});
