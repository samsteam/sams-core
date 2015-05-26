var cocktail = require('cocktail');

//Add Logger annotation.
var Logger = require('../annotations/Logger');
cocktail.use(Logger);

//Using Behavior class.
var Behavior = require('./Behavior');

/*
 *  Adding this trait lets the constructor accept an object as parameter.
 *  Automaticaly, it will map the properties of the object with
 *  the properties defined as instance variables.
 */
//var Configurable = require('cocktail-trait-configurable');
//cocktail.use(Configurable);

/*
 **********************************************************************
 *  This Memory defines Equals and Clone method.                      *
 *  This Memory allows to have the same element twice.                *
 **********************************************************************
 */
cocktail.mix({
  //Define this file as a single class module exportable.
  '@exports' : module,
  '@as' : 'class',

  //'@traits' : [Configurable],

  //Set the logger and signature of this class.
 '@logger' : [console, "Memory:"],

  //Instance variables of the class.
  '@properties': {
    array: undefined,
    size: 0,
    used: 0
  },

  /*
   *  Creates a memory with 'size' ammount of frames.
   */
  constructor: function(size) {
    this.setSize(size);
    this.setArray([]);
    this.log("Created with " + size + " frame.");
  },

  /*
   *  Return whether the memory is full or not.
   */
  isFull: function() {
    if (this.getUsed() === this.getSize()) {
      return true;
    }
    return false;
  },

  /*
   *  Short circuit search for a free frame.
   *  Returns the index of a free frame if there is one.
   *  Otherwise return -1.
   */
  getFreeFrame: function() {
    //Ensure there is space before searching for it.
    if(this.isFull()) {
      return -1;
    }

    //Move all initializations out of the loop.
    var i = 0;
    var array = this.getArray();
    var length = this.getSize();

		for (; i < length; i++) {
			if (array[i] == undefined) {
				return i;
			}
		}
	},

  /*
   *	Look for the frame that contains the element.
   *	If the element isn't found, return -1.
   *  This method is identical to Queue.js indexOf.
   */
  getFrameOf: function(element) {
    //Move all asignations out of the loop.
    var i = 0;
    var array = this.getArray();
    var length = array.length;

    //Ask for the supported comparing method of the element.
    var areEquals = Behavior.ComparingMethod(element);

    for(; i< length; i++) {
        if(areEquals(element, array[i])) {
          return i;
        }
    }
    return -1
  },

  /*
   * Returns whether an element is already in the Memory.
   */
  contains: function(element) {
    if(this.getFrameOf(element) === -1) {
      return false;
    }
    return true;
  },

  /*
   *  Returns a reference to the frame in the position of the Memory.
   *  If the request ask for a frame out of bounds, return undefined.
   *
   *  BEWARE THAT THIS METHOD DOESN'T DIFFERENCE BETWEEN ACCESSING TO
   *  AN OUT OF BOUND POSITION OR ACCESING TO AN UNDEFINED FRAME.
   *
   *  **Should it return a copy(C++ const.)?**
   */
  at: function(position) {
    //Check if the position is out of the array.
    if(position >= this.getSize()) {
      this.log("Access to the position " + position + " out of bounds. Access denied.");
      return undefined;
    }
    return this.getArray()[position];
  },

  /*
   *  Add an element to a certain position of the Memory.
   *  If the position is out of bounds, return false.
   *  Return true when the operation is completed succesfully.
   */
  atPut: function(position, element) {
    //Check if the position is out of the array.
    if(position >= this.getSize()) {
      this.log("Access to the position " + position + " out of bounds. Access denied.");
      return false;
    }

    //Check if the position was free and add 1 to the used acumulator.
    //Log all replaced elements.
    if(this.at(position) === undefined) {
      this.setUsed(this.getUsed() + 1);
    } else {
      this.log(this.at(position).toString() + " at frame[" + position + "] being replaced.");
    }

    //Finally add the element to the Memory and log it.
    this.getArray()[position] = element;
    this.log(element.toString() + " added to the frame[" + position + "].");
    return true;
  },

  /*
   *  Determines the comparing method used in the Memory objects.
   *  This is a deep equivalency comparission.
   */
  equals: function(obj) {
    //For performance improvement, check if they hold the same reference.
    if(this === obj) {
      return true;
    }

    /*
     *  Check that the objects are the same class,
     *  were instantiated with the same params and
     *  if the internal state of the objects at this given time is "similar".
     */
    if(this.constructor !== obj.constructor || this.getSize() !== obj.getSize() || this.getUsed() !== obj.getUsed()) {
      return false;
    }

    //Then it's time for a deep check.
    //Move all asignations out of the loop.
    var i = 0;
    var myArray = this.getArray();
    var herArray = obj.getArray();
    var length = myArray.length;

    /*
     *  Don't use a forEach loop beacuse it skips undefined values.
     *  We want to check for those too.
     *  Also we want to stop in
     */

    for(; i < length; i++) {
      var myElement = myArray[i];
      var herElement = herArray[i];
      /*
       *  If self holds a reference to obj and
       *  at the same time obj holds a reference to self,
       *  That would cause an infinite loop so we skip it.
       */
      if(myElement !== obj || herElement !== this) {
        /*
         *  Use Behavior to ask for the comparing method of myElement.
         *  Then call the function with myElement and herElement.
         */
        if(!Behavior.ComparingMethod(myElement)(myElement, herElement)) {
          return false;
        }
      }
    }
    //After iterating all the elements we know for sure that the objects are equivalents.
    return true;
  },

  /*
   *  Generate a new object equivalent to this one.
   *  Tryes to do a deep clone.
   */
  clone: function() {
    this.log("---Start of Clonation.---");

    //Using Memory class.
    var Memory = require('./Memory');
    var aux = new Memory(this.getSize());

    var myArray = this.getArray();
    myArray.forEach(function(element, index) {
      //Check that the Memory holds a reference to itself.
      //Then add a reference to the new object.
      if(element == this) {
        aux.atPut(index, aux);
      } else {
        /*
         *  Use Behavior to ask for the cloning method of element.
         *  Then call the function with element and assign it to the new Memory.
         */
        aux.atPut(index, Behavior.CloningMethod(element)(element));
      }
    }, this);
    this.log("---End of Clonation.---\n");
    return aux;
  },

  forEach: function(exec, that) {
    var myArray = this.getArray();
    if(that) {
      myArray.forEach(function(element, index) {
        //Use the contex passed by the caller in the execution of the function.
        exec.call(that, element, index);
      },that);
    } else {
      //If no contex was especified use a simple forEach.
      myArray.forEach(function(element, index) {
        exec(element, index);
      });
    }
  }
});
