var cocktail = require('cocktail');
var Logger = require('../../annotations/Logger');
var VictimsStructureInterface = require('./VictimsStructureInterface');

cocktail.use(Logger);

cocktail.mix({
  //Define this file as a single class module exportable.
  '@exports': module,
  '@as': 'class',
	'@traits': [VictimsStructureInterface],

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
   */
  add: function(page) {

    if(!this.contains(page)) {
      this._array.push(page);
      this.log(page.toString() + " added.");
    } else {
      this.log(page.toString() + " was already on the Queue.")
    }
    return this;

  },

  /*
   *  Add multiple pages to the Queue using the add method.
   *  collection must implement the forEach method as it is in Array.
   */
  addAll: function(collection) {
    this.log("Massive assignment started.");
    collection.forEach(function(page) {
			this.add(page);
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
      this.log(page.toString() + " removed.");
    }
    return page;
  },

  remove: function(requirement) {
    var index = this._indexOf(requirement);
    if (index != -1) {
      return (this._array.splice(index, 1))[0];
    }
    return undefined;
  },

  recycle: function(requirement) {
    if(this.remove(requirement)) {
      this.add(requirement);
    }
  },

  /*
   *  Determines if a requirement exists in the queue.
   *  If its found return the index of the element in the array.
   *  Otherwise return -1.
   */
  _indexOf: function (requirement) {
    var i = 0;
    var array = this._array;
    var length = array.length;

    //Use a normal looping to stop when a match is encountered.
    for(; i < length; i++) {
        // console.log(requirement);
        if(requirement.equals(array[i])) {
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

  clone: function() {
    var aux = new this.constructor();
    this._array.forEach(function(page) {
      aux.add(page.clone());
    });

    return aux;
  },

  /*
   * Removes all objects from the Queue.
   */
  clear: function() {
    this._array = [];
    this.log("Cleared.");
  }
});
