var cocktail = require('cocktail');
var Logger = require('../annotations/Logger');
var ReplacementFilterInterface = require('./ReplacementFilterInterface');

cocktail.use(Logger);

cocktail.mix({
	'@exports': module,
	'@as': 'class',
	'@traits': [ReplacementFilterInterface],

	'@logger' : [console, "SecondChanceReplacementPolicy:"],

	constructor: function() {
		this.log("Created.");
	},

	apply: function(filteredVictims, requirement, context) {
		var potentialVictim = filteredVictims.peek();

	  while(potentialVictim.isReferenced()) {
			//Recycle the page in the filteredVictims structure until we get one not referenced.
			//Clear the potentialVictim referenced flag.
			potentialVictim.clearReferenced();
			filteredVictims.recycle(potentialVictim)
			context.recycle(potentialVictim);

			//get a new potentialVictim
			potentialVictim = filteredVictims.peek();
		}
	}
});
