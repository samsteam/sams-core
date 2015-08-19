var cocktail = require('cocktail');
var Logger = require('../annotations/Logger');
var AssignmentFilterInterface = require('./AssignmentFilterInterface');

cocktail.use(Logger);

cocktail.mix({
	'@exports': module,
	'@as': 'class',
	'@traits': [AssignmentFilterInterface],

	'@logger' : [console, "FixedEvenAssignmentPolicy:"],

	constructor: function(localitySize) {
		this._size = localitySize;
		this.log("Created with " + this._size + ".");
	},

	hasFreeFrameFor: function(requirement, memory, context) {

		var processCount = {
			process: requirement.getProcess(),
			count: 0
		};

		memory.forEach(function(frame) {
			if (this.process == frame.getProcess()) {
				this.count++;
			}
		}, processCount);
		return (this._size > processCount.count);

	},

	update: function(memory, context) {
		//Nothing to do here.
	},

	localSize: function() {
	  return this._size;
	}
});
