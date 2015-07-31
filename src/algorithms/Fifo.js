var cocktail = require('cocktail');
var Logger = require('../annotations/Logger');
var AlgorithmInterface = require('./AlgorithmInterface');
var Algorithm = require('./Algorithm');
var Queue = require('../common/VictimsStructures/Queue');

cocktail.use(Logger);

cocktail.mix({
	'@exports': module,
	'@as': 'class',
	'@extends': Algorithm,
	'@traits': [AlgorithmInterface],
	'@logger' : [console, "Algorithm Fifo:"],

	constructor: function() {
		this.callSuper("constructor");
		this._victims = new Queue();
		this.log("Created.");
	},

	addPage: function(requirement) {
  	this._victims.add(requirement.asPage().clearAll());
	},

	getPage: function(page) {
	  return this._victims.pageOf(page);
	},

	update: function(requirement) {
		if (this._victims.contains(requirement)) {
			if (requirement.getMode() === "read") {
	  		this._victims.pageOf(requirement).setReferenced(true);
				this.log("Updated victim queue, referenced.");
			}
			if(requirement.getMode() === "write") {
				this._victims.pageOf(requirement).setModified(true);
				this.log("Updated victim queue, modified.");
			}
			return;
		}
		this.addPage(requirement);
	},

	//Just recycle the page.
	recycle: function(requirement) {
		this._victims.recycle(requirement);
	},

});
