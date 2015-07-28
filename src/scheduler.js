var cocktail = require('cocktail');

//Add Logger annotation.
var Logger = require('../annotations/Logger');
cocktail.use(Logger);

//Using Behavior class.
var Behavior = require('./Behavior');

cocktail.mix({
  '@exports' : module,
  '@as' : 'class',

  '@logger' : [console, "Memory:"],

  constructor: function() {
    this._memory = undefined;
    this._algorithm = undefined;
    this._assignmentPolicies = [];
  },

  setAlgorithm: function(algorithm) {
    if (!algorithm) {
      return;
    }
    switch (algorithm) {
      case 'fifo':
        this.clearPolicies();
        this._algorithm = new Fifo();
        break;
      default:
        return;
    }
  },

  clearPolicies: function() {
    this._assignmentPolicies = [];
    if (this._algorithm) {
      this._algorithm.clearPolicies();
    }
  },

  // to be uncommented when FixedEven is implemented
  // setFixedEvenAssignmentPolicy: function(enabled) {
  //   if (enabled) {
  //     this._assignmentPolicies[0] = new FixedEven();
  //   } else {
  //     this._assignmentPolicies[0] = undefined;
  //   }
  // }

  setLocalReplacementPolicy: function(enabled) {
    this._algorithm.setLocalReplacementPolicy();
  }
});
