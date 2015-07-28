var cocktail = require('cocktail');
var Logger = require('../annotations/Logger');

cocktail.use(Logger);

cocktail.mix({
	'@exports': module,
	'@as': 'class',
	'@logger' : [console, "Algorithm Base:"],

	constructor: function() {
		//Should be initialized by some especification of this class.
		this._victims = undefined;

		this._filters = [];
	},

	victimFor: function(requirement) {
		var filteredVictims = this._victims.clone();

		var i = 0;
		var length = this.filters.length;
		for (i; i < length; i++) {
			this._filters[i].apply(filteredVictims, requirement, this);
		}
		return filteredVictims.next();
	},

	clearPolicies: function() {
	  this._filters = [];
	}
});
