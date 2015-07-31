var cocktail = require('cocktail');
var Logger = require('../annotations/Logger');
var ReplacementFilterInterface = require('./ReplacementFilterInterface');

cocktail.use(Logger);

cocktail.mix({
	'@exports': module,
	'@as': 'class',
	'@traits': [ReplacementFilterInterface],

	'@logger' : [console, "AsyncFlushReplacementPolicy:"],

	constructor: function(counterpartFilter) {
		//This counterpart is the AsyncFlushAssignmentPolicy.
		this._counterpart = counterpartFilter;
		this.log("Created.");
	},

	apply: function(filteredVictims, requirement, context) {
		var potentialVictim = filteredVictims.peek();
		//If the next victim was modified, use the async flush reserved memory field.
		if (potentialVictim.isModified()) {
			this.log("The victim " + potentialVictim + " was modified, applying async flush.");
			this._counterpart.updatePosition(potentialVictim);
			context._victims.remove(potentialVictim);
			var reservedForAsync = this._counterpart.getReserved();
			//Ensure that the only posible victim is the reserved field.
			filteredVictims.clear();
			filteredVictims.add(reservedForAsync);
		}
	}
});
