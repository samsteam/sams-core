var cocktail = require('cocktail');

cocktail.mix({
  //Create Behavior cocktail module and export it.
  '@exports': module,
  '@as': 'module',

  /*
   *  Checks whether the equals method is defined and return a function
   *  that takes two arguments and returns if they are equal
   *  using the method it defined for that request.
   */
  ComparingMethod: function(value){
    if(!value) {
      return (function(a, b) {
        return b === undefined;
      });
    }

    if (typeof value.equals == "function") {
      return (function(a, b) {
        return a.equals(b);
      });
    }

    
    return (function(a, b) {
      return a === b;
    });
  },

  /*
   *  Checks whether the clone method is defined and return a function
   *  that takes an argument and returns a copy of it
   *  using the method it defined for that request.
   */
  CloningMethod: function(value) {
    if(typeof value.clone == "function") {
      return (function(a) {
        return a.clone();
      });
    }
    return (function(a){
      return a;
    });
  }
});
