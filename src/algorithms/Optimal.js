var cocktail = require('cocktail');
var Logger = require('../annotations/Logger');
var AlgorithmInterface = require('./AlgorithmInterface');
var Algorithm = require('./Algorithm');
var Queue = require('../common/VictimsStructures/Queue');
var Page = require('../common/Page');

cocktail.use(Logger);

cocktail.mix({
	'@exports': module,
	'@as': 'class',
	'@extends': Algorithm,
	'@traits': [AlgorithmInterface],
	'@logger' : [console, "Algorithm Optimal:"],

	constructor: function() {
		this.callSuper("constructor");
	  this._victims = new Queue();
		this._orderedVictims = [];
		this.log("Created.");
	},

	initialize: function(requirements) {
		this.callSuper("initialize", requirements);
	  this._victims = new Queue();
		this._orderedVictims = [];
		this._orderVictims();
		this.log("Initialized.");
	},

	victimFor: function(requirement) {
	  var result = this.callSuper("victimFor", requirement);
		// Find the victim & set it as unloaded.
		var page = this._orderedVictims.find(function(page) {
			return (page.process == result.page.getProcess() && page.pageNumber == result.page.getPageNumber());
		});
		page.loaded = false;
		return result;
	},

	update: function(requirement) {
		// Find the new commer, set it as loaded, update its instant & check if is finished.
		var page = this._orderedVictims.find(function(page) {
			return (page.process == requirement.getProcess() && page.pageNumber == requirement.getPageNumber());
		});
		this.log("Page: {process:" + page.process + " pageNumber:" + page.pageNumber  + "} is being updated.");
		page.loaded = true;
		page.index++;
		page.finished = (page.index +1 >= page.requirements.length);

		// Update the victim's structure.
		this._victims = new Queue();

		// Get all the finished pages first (ordered by apparition).
		this._orderedVictims.forEach(function(page) {
		  if (page.finished && page.loaded) {
		  	this._victims.add(page.simpleRequirement[page.index]);
		  }
		}, this);

		// Get the loaded pages and order them by next reference (optimal).

		var loadedNotFinished = [];
		this._orderedVictims.forEach(function(page) {
		  if (!page.finished && page.loaded) {
		  	loadedNotFinished.push(page);
		  }
		});

		loadedNotFinished.sort(function(a, b) {
			// I'm sure they have another requirement, no need to check.
		  return a.requirements[a.index +1] - b.requirements[b.index +1]
		});

		// Finally find'em in order & add'em.
		loadedNotFinished.forEach(function(requirement) {
		  var page = this._orderedVictims.find(function(page) {
		    return (page.process == requirement.process && page.pageNumber == requirement.pageNumber);
		  });
			this._victims.add(page.simpleRequirement[page.index]);
		}, this);
	},

	_orderVictims: function() {
	  var reqs = this._requirements;
		reqs.forEach(function(req, instant) {
			var page = this._orderedVictims.find(function(page) {
			  return (page.process == req.getProcess() && page.pageNumber == req.getPageNumber());
			});
			if(page == undefined) {
				page = {
					process: req.getProcess(),
					pageNumber: req.getPageNumber(),
					finished: false,
					loaded: false,
					index: -1,
					requirements: [],
					simpleRequirement: []
				}
				if (req.getMode() != "finish") {
					this._orderedVictims.push(page);
				}
			}
			page.requirements.push(instant);
			var instant = req.asPage();
			instant.setModified(req.getMode() == "write");
			page.simpleRequirement.push(instant);
		}, this);
		this.log(this._orderedVictims);
	}

});
