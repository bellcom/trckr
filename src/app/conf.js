/**
 * conf.js
 *  Save configuration stuffs
 * 
 * Nothing more than a small "wrapper" for localstorage
 * at the moment.
 */
var conf = {
  get: function(name, opt){
    var val = localStorage["trckr-"+name];
    if(val === undefined){
      return opt;
    }
    return val;
  },

  set: function(name, value){
    localStorage["trckr-"+name] = value;
  }
};

