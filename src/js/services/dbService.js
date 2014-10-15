angular.module('trckr')
  .factory('dbService', ['$q', function($q) {
  var db = openDatabase('db', '1.0', 'database', 2 * 1024 * 1024);

  // Create tables
  db.transaction( function(tx) {
    tx.executeSql("CREATE TABLE IF NOT EXISTS `tasks` (`id` INTEGER PRIMARY KEY NOT NULL UNIQUE, `task` VARCHAR NOT NULL, `description` VARCHAR NOT NULL, `case_name` VARCHAR NOT NULL, `case_id` VARCHAR NOT NULL, `created` INTEGER)");
    tx.executeSql("CREATE TABLE IF NOT EXISTS `time_entries` (`id` INTEGER PRIMARY KEY NOT NULL UNIQUE, `task_id` INTEGER, `start` INTEGER, `stop` INTEGER)");
    tx.executeSql("CREATE TABLE IF NOT EXISTS `register_info` (`id` INTEGER PRIMARY KEY NOT NULL UNIQUE, `task_id` INTEGER, `date_entered` INTEGER, `case_id` VARCHAR NOT NULL, `sugar_id` VARCHAR NOT NULL, `time_length` VARCHAR)");
  });

  function getTasks(timeFrom, timeTo) {
    var deferred = $q.defer();

    var sql = "SELECT * FROM tasks WHERE created > ? AND created < ?";
    var data = [timeFrom, timeTo];

    dbService.tasks = {};
    db.transaction(function(tx) {
      tx.executeSql(sql, data, function(tx, rs) {
        for(var i=0; i<rs.rows.length; i++) {
          var row = rs.rows.item(i);
          dbService.tasks[row.id] = { id: row.id,
                            task: row.task,
                            created: row.created,
                            description: row.description,
                            case_id: row.case_id,
                            case_name: row.case_name
          };
        }
        setTimeEntries().then(function(){
          deferred.resolve(dbService.tasks);
        });
        setRegisterInfo();
      });
    });

    // Get tasks stuff
    return deferred.promise;
  }

  function setTimeEntries() {
    var deferred = $q.defer();
    var sql = "SELECT * FROM time_entries";

    db.transaction(function(tx) {
      tx.executeSql(sql, [], function(tx, rs) {
        for(var i=0; i<rs.rows.length; i++) {
          var row = rs.rows.item(i);
          var task_id = row.task_id;

          if (dbService.tasks[task_id]) {
            if (!dbService.tasks[task_id].time_entries) {
              dbService.tasks[task_id].time_entries = {};
            }
            if (row.stop === '') {
              dbService.tasks[task_id].active = true;
            }
            dbService.tasks[task_id].time_entries[row.id] = {};
            dbService.tasks[task_id].time_entries[row.id].id = row.id;
            dbService.tasks[task_id].time_entries[row.id].start = row.start;
            if (row.stop !== '') {
              dbService.tasks[task_id].time_entries[row.id].stop = row.stop;
            }
          }

        }
        deferred.resolve();
      });
    });
    return deferred.promise;
  }

  function setRegisterInfo(){
    var sql = "SELECT * FROM register_info";

    db.transaction(function(tx) {
      tx.executeSql(sql, [], function(tx, rs) {
        for(var i=0; i<rs.rows.length; i++) {
          var row = rs.rows.item(i);
          var task_id = row.task_id;

          if (dbService.tasks[task_id]) {
            dbService.tasks[task_id].register_info = row;
            dbService.tasks[task_id].register_info.registered = true;
          }
        }
      });
    });
  }

  var dbService = {
    tasks: {},
    getTasks: function(timeFrom, timeTo) {
      return getTasks(timeFrom, timeTo);
    },
    getTimeEntries: function(task_id) {
      var deferred = $q.defer();
      var sql = "SELECT * FROM time_entries WHERE task_id = ?";
      var data = [task_id];

      result = [];
      db.transaction(function(tx) {
        tx.executeSql(sql, data, function(tx, rs) {
          for (var i = 0; i < rs.rows.length; i++) {
                var row = rs.rows.item(i);
                result[i] = { id: row.id,
                              start: row.start,
                              stop: row.stop
                };
            }
          deferred.resolve(result);
        });
      });

      // Get tasks stuff
      return deferred.promise;
    },
    saveTask: function(task) {
      var sql = '';
      var data = [];

      if (task.id === undefined) {

        var id = null;
        var created = new Date().getTime();
        sql = "INSERT INTO tasks(id, task, description, case_name, case_id, created) VALUES (?, ?, ?, ?, ?, ?)";
        data = [id, task.task, task.description, task.case_name, task.case_id, created];
      }
      else {
        sql = "Update tasks SET task = ?, description = ?, case_name = ?, case_id = ? WHERE id = ?";
        data = [task.task, task.description, task.case_name, task.case_id, task.id];

      }
      db.transaction(function(tx) {
        tx.executeSql(sql, data, function(transaction, result){
          if (task.id === undefined && result.insertId) {
            dbService.startTime(result.insertId);
          }
        });
      });
    },
    deleteTask: function(id) {
      db.transaction(function(tx) {
        var data = [id];
        var sql = "DELETE FROM tasks WHERE id = ?";
        tx.executeSql(sql, data);

        sql = "DELETE FROM time_entries WHERE task_id = ?";
        tx.executeSql(sql, data);

        sql = "DELETE FROM register_info WHERE task_id = ?";
        tx.executeSql(sql, data);
      });

      delete dbService.tasks[id];
    },
    addTimeEntry: function(task_id, start, stop) {
      var deferred = $q.defer();
      var sql = "INSERT INTO time_entries(task_id, start, stop) VALUES (?, ?, ?)";
      var data = [task_id, start, stop];

      db.transaction(function(tx) {
        tx.executeSql(sql, data, function(transaction, result) {
          deferred.resolve(result.insertId);
        });
      });

      return deferred.promise;
    },
    startTime: function(task_id) {
      dbService.endAllTimeEntries().then(function(){
        var start = new Date().getTime();
        dbService.addTimeEntry(task_id, start, '').then(function(insertId){
          dbService.tasks[task_id].active = true;
          if (dbService.tasks[task_id].time_entries === undefined) {
            dbService.tasks[task_id].time_entries = {};
          }
          dbService.tasks[task_id].time_entries[insertId] = {
            task_id: task_id,
            id: insertId,
            start: start,
          };
        });
      });
    },
    endAllTimeEntries: function() {
      var deferred = $q.defer();

      angular.forEach(dbService.tasks, function(value, key){
        if (value.active) {
          dbService.tasks[key].active = false;
        }
      });

      var sql = "UPDATE time_entries SET stop = ? WHERE stop = ''";
      var data = [new Date().getTime()];

      db.transaction(function(tx) {
        tx.executeSql(sql, data, function(){
          deferred.resolve();
        });
      });

      return deferred.promise;
    },
    updateTimeEntry: function(start, stop, id) {
      var sql = '';
      var data = [];

      if (start === null) {
        sql = "UPDATE time_entries SET stop = ? WHERE id = ?";
        data = [stop, id];
      }
      else {
        sql = "UPDATE time_entries SET start = ?, stop = ? WHERE id = ?";
        data = [start, stop, id];
      }

      db.transaction(function(tx) {
        tx.executeSql(sql, data);
      });
    },
    deleteTimeEntry: function(task_id, time_entry_id) {
      delete dbService.tasks[task_id].time_entries[time_entry_id];
      var sql = "DELETE FROM time_entries WHERE id = ?";
      var data = [time_entry_id];

      db.transaction(function(tx) {
        tx.executeSql(sql, data);
      });
    },
    registerTask: function(task) {
      var deferred = $q.defer();

      // @todo: redo the calculation of minutes
      task.total = calculate_total_for_task(task);

      var data = {
        login: {
          endpoint: localStorage.crmEndpoint,
          user: localStorage.crmUsername,
          pass: localStorage.crmPassword
        },
        task: task
      };

      $.post(localStorage.trckrServer + '/trckr.php?q=register', data).success(function(data){
        if(data.status === "success"){
          dbService.tasks[task.id].register_info = {};
          dbService.tasks[task.id].register_info.case_id = data.message.case_id;
          dbService.tasks[task.id].register_info.sugar_id = data.message.crm_id;
          dbService.tasks[task.id].register_info.date_entered = data.message.timestamp;
          dbService.tasks[task.id].register_info.time_length = data.message.time_length;
          dbService.saveRegiserInfo(dbService.tasks[task.id]);

          deferred.resolve({'registered': true});
        }
      });
      return deferred.promise;
    },
    saveRegiserInfo: function(task) {
      var sql = "INSERT INTO register_info(task_id, date_entered, sugar_id, case_id, time_length) VALUES (?, ?, ?, ?, ?)";
      var data = [
        task.id,
        task.register_info.date_entered,
        task.register_info.sugar_id,
        task.register_info.case_id,
        task.register_info.time_length,
      ];

      db.transaction(function(tx) {
        tx.executeSql(sql, data);
      });
    }
  };

  return dbService;
  }
]);
