var cocktail = require('cocktail');


cocktail.mix({
  //Create logger cocktail annotation and export it as a module.
  '@annotation': 'logger',

  '@exports': module,

  //_logger should implement the log method.
  _logger: undefined,
  _prefix: undefined,
  _debug: undefined,

  //Called to initialize when the anotation is used.
  //Cocktail enforces this method to recive a single parameter.
  setParameter: function(parameter) {
    /**********************************************************
     *  SET THIS VARIABLE TO FALSE WHEN GOING TO PRODUCTION!  *
     **********************************************************
     */
    this._debug = false;

    //Check if the object passed has the method that we will use to log.
    if(typeof parameter[0].log == "function") {
      this._logger = parameter[0];
    } else {
      //Define a default logger if the one provided by the class was invalid.
      this._logger = console;
    }
    this._prefix = parameter[1];
  },

  //Here is defined what to do if the annotation is called.
  process: function(subject, options) {
    //When set to false, logs wont be displayed.
    var debug = this._debug;
    var logger = this._logger;
    var prefix = this._prefix;
    host = subject.prototype || subject;
    //Host is the object I want to add functionality to.
    host.log = function(message){
      if(debug && logger) {
        logger.log.call(logger, prefix ,message);
      }
    };
  }
});
