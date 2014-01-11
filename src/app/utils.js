/**
 * utils.js
 */
var utils = (function() {
  var clients = {time: 0};
  var utils = {
    // Convert formatted time to ms
    get_ms : function(ftime){
      ftime_array = ftime.split(':');

      ms = parseInt(ftime_array[0]) * 60 * 60 * 1000;
      ms += parseInt(ftime_array[1]) * 60 * 1000;

      return ms;
    },

    // Get the time in ms from a tracker.
    get_time : function(tracker) {
      var time = 0;

      if(tracker.active){
        time = (new Date().getTime() - tracker.start + tracker.time);
      }
      else {
        time = (tracker.time);
      }

      return time;
    },

    // Format ms to hh:mm.
    format_time : function(ms) {
      var sec = ms / 1000;

      var min = Math.floor(sec / 60 % 60);

      if(min < 10) {
        min = "0" + min;
      }

      var hrs = Math.floor(sec / 60 / 60 % 60);

      if(hrs < 10) {
        hrs = "0" + hrs;
      }

      return hrs + ":" + min;
    },

    // Get clients
    get_clients : function(callback) {
      var url = conf.get('url');
      var data = {
        login : {
          user: conf.get('user'),
          pass: conf.get('pass')
        }
      }

      if(
          clients['data'] === undefined && 
          (clients['time'] + ( 6 * 60 * 1000)) >= new Date().getTime()
        ){

        var clientInterval = setInterval(function(){
          if(clients['data'] !== undefined){
            callback(clients['data']);
            clearInterval(clientInterval);
          }
        }, 500);
        return;
      }

      if((clients['time'] + ( 6 * 60 * 1000)) <= new Date().getTime()) {
        clients['time'] = new Date().getTime();
        $.post(url + '?q=getClients', data).done(function(data){
          clients['data'] = data;
          callback(data);
        }).fail(function(){
          clients['data'] = {id: 1, name: "Connection Error"}
        });
      }
      else {
        callback(clients['data']);
      }
    },

    map_client : function(name, callback, timestamp){
      this.get_clients(function(data){
        for(key in data){
          if(data[key].name === name){
            callback(data[key].id, timestamp);
          }
        }
      });
    }
  }
  return utils;
})();
