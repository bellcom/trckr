/**
 * db.js
 */
var db = openDatabase('trckr', '1.0', 'database for trackers', 2 * 1024 * 1024);

/**
 * Set up tables
 */
db.transaction(function (tx) {
  tx.executeSql('CREATE TABLE IF NOT EXISTS trackers (active BLOB, registerstatus TEXT, registermessage TEXT, registered TEXT, timestamp NUMERIC, id INTEGER PRIMARY KEY, name TEXT, time NUMERIC, client TEXT, start NUMERIC, stop NUMERIC);');
});

/**
 * Save trackers to db
 */
var saveTrackers = function(trackers){
  for(var index in trackers) {
    loadTracker(index, saveTracker, trackers[index]);
  }
  
};

var saveTracker = function(param, tracker){
  if(param === 0){
    db.transaction(function(tx){
      tx.executeSql('INSERT INTO trackers (id, timestamp, start, active, time, name, client) VALUES (?, ?, ?, ?, ?, ?, ?)', [tracker.timestamp, tracker.timestamp, tracker.start, tracker.active, tracker.time, tracker.name, tracker.client]);
    });
  }
  else {
    db.transaction(function(tx){
      tx.executeSql('UPDATE trackers SET start = ?, active = ?, time = ?, name = ?, client = ?, registermessage = ?, registerstatus = ? WHERE id = ?', [tracker.start, tracker.active, tracker.time, tracker.name, tracker.client, tracker.registermessage, tracker.registerstatus, tracker.timestamp]);
    });
  }
};

var deleteTracker = function(timestamp){
  db.transaction(function(tx){
    tx.executeSql('DELETE FROM trackers WHERE timestamp = ?', [timestamp]);
  });
};

var loadTracker = function(timestamp, callback, tracker){
  db.transaction(function(tx){
    tx.executeSql('SELECT * FROM trackers WHERE timestamp = ?', [timestamp], function (tx, results) {
      if(results.rows.length === 0){
        callback(0, tracker);
      }
      else {
        callback(results.rows.item, tracker);
      }
    });
  });
};

/**
 *
 */
var loadTrackers = function(callback, from , to){
  if(!from) {
    from = new Date();
    from.setHours(0,0,0,0);
    from = from.getTime();
  }

  if(!to) {
    to = new Date();
    to.setHours(23,59,0,0);
    to = to.getTime();
  }

  db.transaction(function(tx){
    tx.executeSql('SELECT * FROM trackers WHERE timestamp < ? AND timestamp > ?', [to, from], function (tx, results) {
      var len = results.rows.length, i, result;
      var trackers = {};
      var active;

      for (i = 0; i < len; i++) {
        result = JSON.parse(JSON.stringify(results.rows.item(i)));
        trackers[result.timestamp] = result;
        active = (trackers[result.timestamp].active === "true");
        trackers[result.timestamp].active = active;
      }
      callback(trackers);
    });
  });
};

var deleteTrackers = function(trackers){
  db.transaction(function(tx){
    tx.executeSql('DELETE FROM trackers WHERE 1');
  });
};
