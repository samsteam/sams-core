var cocktail = require('cocktail');
var Logger = require('../../annotations/Logger');
var VictimsStructure = require('./VictimsStructure');

cocktail.use(Logger);

var Behavior = require('./Behavior');
/*
 **********************************************************************
 *  This Queue doesn't define Equals nor Clone method. Should it?     *
 *  This Queue doesn't allow to have the same element twice.          *
 **********************************************************************
 */
cocktail.mix({
  //Define this file as a single class module exportable.
  '@exports': module,
  '@as': 'class',
	'@traits': [VictimsStructure],


  '@logger' : [console, "VictimsQueue:"],

  constructor: function() {
    /*
     *  According to @elmasse default variable initialization must be done
     *  in the constructor and not in the @properties declaration.
     */
    this._array = [];
    this.log("Created.");
  },

  /*
   *  Add a page to the Queue.
   *  If the page is already in the queue, remove it,
   *  then enqueue it again.
   */
  add: function(page) {
    var array = this._array;
    var index = this._indexOf(element);

    //Don't use contains method here because
    //you would have to search again for the index.
    if (index != -1) {
      array.splice(index ,1);
      this.log(element.toString() + " removed. Waiting to requeue.");
    }

    //Always add the element to the queue.
    array.push(element);
    this.log(element.toString() + " added.");

    return this;
  },

  /*
   *  Add multiple pages to the Queue using the add method.
   *  collection must implement the forEach method as it is in Array.
   */
  addAll: function(collection) {
    this.log("Massive assignment started.");
    collection.forEach(function(page) {
			this.enqueue(page);
		}, this);
    this.log("Massive assignment finished.");

    return this;
  },

  /*
   * Returns the size of the queue at a given time.
   */
  size: function() {
    return this._array.length;
  },

  /*
   *  Returns a reference to the first page of the Queue.
   *  The page is conserved in the structure.
   */
  peek: function() {
    return this._array[0];
  },

  /*
   *	Returns the first page of the Queue deleting it from the structure.
   */
  first: function() {
    var page = this._array.shift();
    if (page) {
      this.log(element.toString() + " removed.");
    }
    return page;
  },

  /*
   *  Determines if a requirement exists in the queue.
   *  If its found return the index of the element in the array.
   *  Otherwise return -1.
   */
  _indexOf: function (requirement) {
    var i = 0;
    var array = this.getArray();
    var length = array.length;

    //Use a normal looping to stop when a match is encountered.
    for(; i< length; i++) {
        if(element.equals(array[i])) {
          return i;
        }
    }
    return -1
  },

	/*
	 *	Returns a reference to the page in the queue
	 *	That matches the asked requirement.
	 */
	pageOf: function(requirement) {
		var index = this._indexOf(requirement);
	  if( index === -1) {
			return undefined;
		}
		return this._array[index];
	},

  /*
   * Returns whether an element is already in the Queue.
   */
  contains: function (element) {
    if (this._indexOf(element) === -1) {
      return false;
    }
    return true;
  },

  /*
   * Removes all objects from the Queue.
   */
  clear: function() {
    this.setArray([]);
    this.log("Cleared.");
  }
});
