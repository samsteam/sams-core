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
    referenced: false
  },

	/*
	 *	The constructor accept an object like this:
	 *	{
	 *		'process': 'A',
	 *		'pageNumber': 1,
	 *		'mode' : 'write',
   *    'pageFault' : false
	 *	}
	 *	Automaticaly is maped to the corresponding properties
	 *	thanks to the Configurable trait.
	 */

   //@Override
  asSimpleObject: function() {
    var obj =
		{
			process : this.getProcess(),
			pageNumber : this.getPageNumber(),
			mode : this.getMode(),
      pageFault : this.isPageFault(),
      referenced : this.isReferenced()
		}
    return obj;
  },
  //@Override
	clone : function() {
    this.log("---Start of Clonation.---");

    //Using Page class.
    var Page = require('./Page');
    var aux = new Page(this.asSimpleObject());

    this.log("---End of Clonation.---");
		return aux;
	},

  //Clearing Page flags methods.
  clearPageFault: function() {
    this.setPageFault(false);
    return this;
  },

  clearReferenced: function() {
    this.setReferenced(false);
    return this;
  },

  clearAll: function() {
    this.clearPageFault();
    this.clearReferenced();
    return this;
  },

  //@Override
  asPage: function() {
    return this.clone();
  }
});
