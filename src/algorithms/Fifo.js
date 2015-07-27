var cocktail = require('cocktail');
var Logger = require('../annotations/Logger');
var Algorithm = require('./Algorithm');
var Queue = require('../common/VictimsStructures/Queue');

cocktail.use(Logger);

var Behavior = require('./Behavior');

cocktail.mix({
	'@exports': module,
	'@as': 'class',
	'@extends': Algorithm,
	'@logger' : [console, "Algorithm Fifo:"],

	constructor: function() {
		this._victims = new Queue();
	},

	addPage: function(requirement) {
	  this._victims.add(requirement.asPage().clearAll());
	},

	getPage: function(page) {
	  return this._victims.pageOf(page);
	},

	update: function(requirement) {
	  this._victims.pageOf(requirement).setReferenced(true);
	},

	//Just re-add the page.
	recycle: function(requirement) {
		this.addPage(requirement);
	},

});
