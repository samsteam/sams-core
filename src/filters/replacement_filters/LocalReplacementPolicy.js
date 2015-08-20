var cocktail = require('cocktail');
var Logger = require('../../annotations/Logger');
var ReplacementFilterInterface = require('./ReplacementFilterInterface');

cocktail.use(Logger);

cocktail.mix({
	'@exports': module,
	'@as': 'class',
	'@traits': [ReplacementFilterInterface],

	'@logger' : [console, "LocalReplacementPolicy:"],

	constructor: function() {
		this.log("Created.");
	},

	apply: function(filteredVictims, requirement, context) {
		var potentialVictim = filteredVictims.peek();

	  while(filteredVictims.size() && potentialVictim.getProcess() !== requirement.getProcess()) {
			this.log("The victim " + potentialVictim + " was isn't from the same process, Applying Local filter.");
			//Remove the page from the filteredVictims structure.
			filteredVictims.remove(potentialVictim);

			//get a new potentialVictim
			potentialVictim = filteredVictims.peek();
		}
		if (!filteredVictims.size()) {
			throw new Error("The new process has no free frames to be assigned!!");
		}
	}
});
