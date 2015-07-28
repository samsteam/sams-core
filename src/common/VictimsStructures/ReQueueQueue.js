var cocktail = require('cocktail');
var Logger = require('../../annotations/Logger');
var VictimsStructureInterface = require('./VictimsStructureInterface');
var Queue = require('./Queue');

cocktail.use(Logger);

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
	'@extends': Queue,
	'@traits': [VictimsStructureInterface],


  '@logger' : [console, "VictimsReQQueue:"],

	/*
   *  Add a page to the Queue.
   *  If the page is already in the queue, remove it,
   *  then enqueue it again.
   */
	 //@Override
  add: function(page) {

    //Don't use contains method here because
    //you would have to search again for the index.
    var array = this._array;
    var index = this._indexOf(page);

    if (index != -1) {
      array.splice(index ,1);
      this.log(page.toString() + " removed. Waiting to requeue.");
    }

    this.callSuper("add", page);

		return this;
  }
});
