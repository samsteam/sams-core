var cocktail = require('cocktail');
var Logger = require('../../annotations/Logger');
var AssignmentFilterInterface = require('./AssignmentFilterInterface');

cocktail.use(Logger);

cocktail.mix({
	'@exports': module,
	'@as': 'class',
	'@traits': [AssignmentFilterInterface],

	'@logger' : [console, "FixedEvenAssignmentPolicy:"],

	constructor: function() {
		this._size = 0;
		this.log("Created.");
	},

	initialize: function(memorySize, requirements) {
		var processes = { cant: 0};
		requirements.forEach(function(elem) {
		  if (!processes[elem.getProcess()]) {
		  	processes[elem.getProcess()] = true;
				processes.cant++;
		  }
		});
		this._size = Math.floor(memorySize / processes.cant);
		this.log("Assumed size: " + this._size + ".");
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

	localSize: function() {
	  return this._size;
	}
});
