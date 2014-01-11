/**
 * notify.js
 */
var sys = require('sys');
var exec = require('child_process').exec;

function notify(){
  var message, name, client, time;
  var interval = parseInt(conf.get('notify_interval'));

  // Notify loop.
  var notifyInterval = setInterval(function(){
    // Load trackers.
    message = 'Trckr "No active tracker"';
    loadTrackers(function(data){
      // Find out which tracker is active.
      for(key in data){
        message = '';

        if(data[key].active) {
          name = data[key].name;
          client = data[key].client;
          time = utils.format_time(utils.get_time(data[key]));
    
          message = 'Trckr "Task:  '+ name + '\nClient: ' + client + '\nTime:  ' + time + '"';
        }

      }
      // Execute notify-send command with the message.
      exec("notify-send " + message);
    });

  }, (interval * 60 * 1000));
}

if(conf.get('notify_enable') === "1") {
  notify();
}
