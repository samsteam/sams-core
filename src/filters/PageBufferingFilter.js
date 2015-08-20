var cocktail = require('cocktail');
var Logger = require('../annotations/Logger');
var Page = require('../common/Page');

cocktail.use(Logger);

cocktail.mix({
	'@exports': module,
	'@as': 'class',

	'@logger' : [console, "PageBufferingFilter:"],

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
				'reservedForPageBuffering': true
			});
		this._position = 0;
		this._memory = undefined;
		this.log("Created.");
	},

	update: function(memory) {
		this._memory = memory;
		memory.atPut(this._position, this._reserved.clone());
		this.log("The frame reserved for page buffering was updated.");
	},

	apply: function(filteredVictims, requirement, context) {
		var potentialVictim = filteredVictims.peek();
		//If the next victim was modified, use the async flush reserved memory field.
		if (potentialVictim.isModified()) {
			this.log("The victim " + potentialVictim + " was modified, applying page buffering.");
			this._updatePosition(potentialVictim);
			context._victims.remove(potentialVictim);
			var reservedForPageBuffering = this._reserved.clone();

			//Ensure that the only posible victim is the reserved field.
			filteredVictims.clear();
			filteredVictims.add(reservedForPageBuffering);
		}
	},

	_updatePosition: function(requirement) {
	  this._position = this._memory.getFrameOf(requirement);
		this.log("The reference to the frame was updated, " + this._position + ".");
	}
});
