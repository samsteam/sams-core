var cocktail = require('cocktail');

//Add Logger annotation.
var Logger = require('../annotations/Logger');
cocktail.use(Logger);

//Inheriting from Requirement Class.
var Requirement = require('./Requirement');

/*
 *  Adding this trait lets the constructor accept an object as parameter.
 *  Automaticaly, it will map the properties of the object with
 *  the properties defined as instance variables.
 */
var Configurable = require('cocktail-trait-configurable');


cocktail.mix({
	//Define this file as a single class module exportable.
  '@exports' : module,
  '@as' : 'class',
  '@extends' : Requirement,

  '@traits' : [Configurable],

  //Set the logger and signature of this class.
  '@logger' : [console, "Page:"],

  //Instance variables of the class.
  '@properties': {
    pageFault: false,
    required : false,
    referenced: false,
    modified: false,
    finished: false,
    reservedForPageBuffering: false
  },

  '@static': {
    empty: function () {
      var Page = require('./Page');
  		return new Page({
        'process': 'empty',
        'pageNumber': 0,
        'mode': '',
        'pageFault': false,
        'required': false,
        'referenced': false,
        'modified':  false,
        'finished': false,
        'reservedForPageBuffering': false
      });
    }
  },

	/*
	 *	The constructor accept an object like this:
	 *	{
	 *		'process': 'A',
	 *		'pageNumber': 1,
	 *		'mode' : 'write',
   *    'pageFault' : false,
   *    'required' : false,
   *    'referenced': false,
   *    'modified' :  false,
   *    'finished' : false,
   *    'reservedForPageBuffering' : false
	 *	}
	 *	Automaticaly is maped to the corresponding properties
	 *	thanks to the Configurable trait.
	 */

   //@Override
  asDataObject: function() {
    var obj =
		{
			process : this.getProcess(),
			pageNumber : this.getPageNumber(),
      pageFault : this.isPageFault(),
      required : this.isRequired(),
      referenced : this.isReferenced(),
      modified: this.isModified(),
      finished: this.isFinished(),
      reservedForPageBuffering: this.isReservedForPageBuffering()
		}
    return obj;
  },

  asVictim: function() {
    var obj =
		{
			process : this.getProcess(),
			pageNumber : this.getPageNumber(),
      referenced : this.isReferenced(),
      modified: this.isModified(),
      finished: this.isFinished()
		}
    return obj;
  },

  //@Override
	clone : function() {
    var Page = require('./Page');
    var aux = new Page(this.asDataObject());
		return aux;
	},

  //Clearing Page flags methods.
  clearPageFault: function() {
    this.setPageFault(false);
    return this;
  },

  clearRequired: function() {
    this.setRequired(false);
    return this;
  },

  clearReferenced: function() {
    this.setReferenced(false);
    return this;
  },

  clearModified: function() {
    this.setModified(false);
  },

  clearFinished: function() {
    this.setFinished(false);
  },

  clearReservedForPageBuffering: function() {
    this.setReservedForPageBuffering(false);
  },

  clearAll: function() {
    this.clearPageFault();
    this.clearRequired();
    this.clearReferenced();
    this.clearModified();
    this.clearFinished();
    this.clearReservedForPageBuffering();
    return this;
  },

  //@Override
  asPage: function() {
    return this.clone();
  }
});
