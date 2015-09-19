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
	'@logger' : [console, "Algorithm Nru:"],

	constructor: function() {
		this.callSuper("constructor");
		this._instant = 0;
		this._victims = new Queue();
		this._orderedVictims = {};
		this.log("Created.");
	},

	initialize: function(requirements) {
		this.callSuper("initialize", requirements);
		this._instant = 0;
	  this._victims = new Queue();
		this._orderedVictims = {};
		this._orderVictims();
		this.log("Initialized.");
	},

	addPage: function(requirement) {
  	// this._victims.add(requirement.asPage().clearAll());
	},

	getPage: function(page) {
	  // return this._victims.pageOf(page);
	},

	update: function(requirement) {

		this._instant++;
		var highestLesser = {};

		for (key in this._orderedVictims) {
			this._orderedVictims[key].forEach(function(instant) {
			  if (instant < this._instant) {
					highestLesser[key] = instant;
			  }
			}, this);
		}

		var sortable = [];
		for (var page in highestLesser) {
	      sortable.push([page, highestLesser[page]]);
			}

		sortable.sort(function(a, b) {return a[1] - b[1]});
		sortable.forEach(function(elem) {
			this._victims.add(this._requirements[elem[1]].asPage());
		}, this);

	},

	_orderVictims: function() {
	  var reqs = this._requirements;
		reqs.forEach(function(elem, index) {
			var key = elem.getProcess() + elem.getPageNumber();
			if (!this._orderedVictims[key]) {
				this._orderedVictims[key] = [];
			}
			this._orderedVictims[key].push(index)
		}, this);
		this.log(this._orderedVictims);
	}

});
