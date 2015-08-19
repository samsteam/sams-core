var cocktail = require('cocktail');
var Logger = require('../annotations/Logger');
var AssignmentFilterInterface = require('./AssignmentFilterInterface');
var Page = require('../common/Page');

cocktail.use(Logger);

cocktail.mix({
	'@exports': module,
	'@as': 'class',
	'@traits': [AssignmentFilterInterface],

	'@logger' : [console, "AsyncFlushAssignmentPolicy:"],

	constructor: function() {
		this._reserved = new Page(
			{
				'process': '',
				'pageNumber': 0,
				'mode' : 'reserved',
				'pageFault' : false,
				'required' : false,
				'referenced': false,
				'modified': false,
				'reservedForAsyncFlush': true
			});
		this._position = 0;
		this._memory = undefined;
		this.log("Created.");
	},

	hasFreeFrameFor: function(requirement, memory, context) {
		//Save a reference to the actual memory.
		this._memory = memory;
		return true;
	},

	update: function(memory, context) {
		this._updateMemory(memory, context);
	},

	_updateMemory:	function(memory, context) {
		memory.atPut(this._position, this._reserved.clone());
		this.log("The reserved Async Flush Frame was updated.");
	},

	updatePosition: function(requirement) {
	  this._position = this._memory.getFrameOf(requirement);
		this.log("The reserved Async Flush reference was updated, " + this._position + ".");
	},

	getReserved: function() {
	  return this._reserved.clone();
	}
});
