var cocktail = require('cocktail');

//Add Logger annotation.
var Logger = require('../annotations/Logger');
cocktail.use(Logger);

//Using Behavior class.
var Behavior = require('./Behavior');
//This class uses Page class, but its requirement is delayed until runtime.

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

  '@traits' : [Configurable],

  //Set the logger and signature of this class.
  '@logger' : [console, "Requirement:"],

  //Instance variables of the class.
  '@properties': {
    process: "",
		pageNumber: 0,
		mode: "read"
  },

	/*
	 *	The constructor accept an object like this:
	 *	{
	 *		'process': 'A',
	 *		'pageNumber': 1,
	 *		'mode' : 'write'
	 *	}
	 *	Automaticaly is maped to the corresponding properties
	 *	thanks to the Configurable trait.
	 */
  constructor: function(options) {
		this.configure(options);
    //Check that the object was created fine.
    if(this.validate) {
      this.log("Created.");
    } else {
      //This warning should be seen even in production.
      console.warn("A requirement was created with default values.");
    }
  },

  validate: function() {
    var process = this.getProcess();
    var pageNumber = this.getPageNumber();
    var mode = this.getMode();
    if ((process == "") || (typeof pageNumber !== "number") ||
        (mode !== "read" && mode !== "write" && mode !== "finish" && mode !== "reserved")) {
      return false;
    }
    return true;
  },

	equals: function(obj) {
		//For performance improvement, check if they hold the same reference.
    if (!obj) {
      return false;
    }

		if(this === obj) {
			return true;
		}

		/*
		*  Check that the objects are the same class,
		*  were instantiated with the same params and
		*  if the internal state of the objects at this given time is "similar".
		*/
		if(this.constructor !== obj.constructor || this.getProcess() !== obj.getProcess() ||
			this.getPageNumber() !== obj.getPageNumber()) {
			return false;
		}
		//Seems like they are the same.
		return true;
	},

  asDataObject: function() {
    var obj =
		{
			process : this.getProcess(),
			pageNumber : this.getPageNumber(),
      mode: this.getMode()
		}
    return obj;
  },

  asPage: function() {
    var obj = this.asDataObject();
    //Set a requirement on page fault by default.
    obj.pageFault = true;
    obj.referenced = true;
    obj.modified = false;
    obj.reservedForAsyncFlush = false;

    //Using Page class.
    var Page = require('./Page');
    var aux = new Page(obj);

    return aux;
  },

	clone : function() {
    var Requirement = require('./Requirement');
    var aux = new Requirement(this.asDataObject());
	  return aux;
	},

  toString: function() {
    return JSON.stringify(this.asDataObject());
  }
});
