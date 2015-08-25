var cocktail = require('cocktail');
var Logger = require('../annotations/Logger');
var AlgorithmInterface = require('./AlgorithmInterface');
var Fifo = require('./Fifo');
var Queue = require('../common/VictimsStructures/Queue');
var ReQueueQueue = require('../common/VictimsStructures/ReQueueQueue');

cocktail.use(Logger);

cocktail.mix({
	'@exports': module,
	'@as': 'class',
	'@extends': Fifo,
	'@traits': [AlgorithmInterface],
	'@logger' : [console, "Algorithm Lru:"],

	constructor: function() {
		this.callSuper("constructor");
		this._victims = new ReQueueQueue();
		this.log("Created.");
	},

	initialize: function(requirements) {
		this._requirements = requirements;
		this._finalized = new Queue();
	  this._victims = new ReQueueQueue();
	}
});
