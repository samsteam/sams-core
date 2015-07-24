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
 *  In this case is not needed because the constructor dosn't take parameters.
 */
// var Configurable = require('cocktail-trait-configurable');

/*
 **********************************************************************
 *  This Queue doesn't define Equals nor Clone method. Should it?     *
 *  This Queue doesn't allow to have the same element twice.          *
 **********************************************************************
 */
cocktail.mix({
  //Define this file as a single class module exportable.
  '@exports' : module,
  '@as' : 'class',

  //'@traits' : [Configurable],

  //Set the logger and signature of this class.
  '@logger' : [console, "Queue:"],

  //Instance variables of the class.
  '@properties': {
    /*
     *  This variable could be defined as "private"
     *  by moving it out of the @properties annotation.
     */
    array: undefined
  },

  constructor: function() {
    /*
     *  According to @elmasse default variable initialization must be done
     *  in the constructor and not in the @properties declaration.
     */
    this.setArray([]);
    this.log("Created.");
  },

  /*
   * Returns the size of the queue at a given time.
   */
  size: function() {
    return this.getArray().length;
  },

  /*
   *  Returns a reference to the first element of the Queue.
   *  The element is conserved in the structure.
   *  **Should it return a copy(C++ const.)?**
   */
  peek: function() {
    return this.getArray()[0];
  },

  /*
   *  Determines if an element exists in the queue.
   *  The check is made through the equals method if its defined.
   *  If its found return the index of the element in the array.
   *  Otherwise return -1.
   */
  indexOf: function (element) {
    //Move all asignations out of the loop.
    var i = 0;
    var array = this.getArray();
    var length = array.length;

    //Ask for the supported comparing method of the element.
    var areEquals = Behavior.ComparingMethod(element);

    //Use a normal looping to stop when a match is encountered.
    for(; i< length; i++) {
        if(areEquals(element, array[i])) {
          return i;
        }
    }
    return -1
  },

  /*
   * Returns whether an element is already in the Queue.
   */
  contains: function (element) {
    if (this.indexOf(element) === -1) {
      return false;
    }
    return true;
  },

  /*
   *  Add an element to the Queue.
   *  If the element is already in the queue, remove it,
   *  then enqueue the element.
   *  The check is made through the equals method if its defined.
   */
  enqueue: function(element) {
    var array = this.getArray();
    var index = this.indexOf(element);

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
   *  Add multiple elements to the Queue using the enqueue method.
   *  aCollection must implement the forEach method as it is in Array.
   */
  addAll: function(aCollection) {
    this.log("Massive assignment started.");
    aCollection.forEach(function(element) {
			this.enqueue(element);
		}, this);
    this.log("Massive assignment finished.");
		return this;
  },

  /*
   *	Returns the first element of the Queue deleting it from the structure.
   */
  dequeue: function() {
    var element = this.getArray().shift();
    if ( element ) {
      this.log(element.toString() + " removed.");
    }
    return element;
  },

  /*
   * Removes all objects from the Queue.
   */
  clear: function() {
    this.setArray([]);
    this.log("Cleared.");
  }
});
