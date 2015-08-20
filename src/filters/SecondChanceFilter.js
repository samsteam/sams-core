var cocktail = require('cocktail');
var Logger = require('../annotations/Logger');

cocktail.use(Logger);

cocktail.mix({
	'@exports': module,
	'@as': 'class',

	'@logger' : [console, "SecondChanceFilter:"],

	constructor: function() {
		this._toClear = undefined;
		this.log("Created.");
	},

	update: function(memory) {
		if(this._toClear) {
			this._toClear.forEach(function(requirement) {
				memory.at(memory.getFrameOf(requirement)).clearReferenced();
			});
		}
		this._toClear = [];
	},

	apply: function(filteredVictims, requirement, context) {
		this._toClear = [];
		var potentialVictim = filteredVictims.peek();

	  while(potentialVictim.isReferenced()) {
			this.log("The victim " + potentialVictim + " was referenced, applying 2nd chance.");
			//Recycle the page in the filteredVictims structure until we get one not referenced.
			//Clear the potentialVictim referenced flag.
			this._toClear.push(potentialVictim);
			potentialVictim.clearReferenced();
			filteredVictims.recycle(potentialVictim);
			context.recycle(potentialVictim);

			//get a new potentialVictim
			potentialVictim = filteredVictims.peek();
		}
	}
});
