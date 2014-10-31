// Load native UI library
var gui = require('nw.gui'); //or global.window.nwDispatcher.requireNwGui() (see https://github.com/rogerwang/node-webkit/issues/707)

// Get the current window
var win = gui.Window.get();

angular.module('trckr', ['ui.bootstrap', 'ngRoute']);

/**
 * Route provider
 */
angular.module('trckr').config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'templates/list/pageTaskList.html',
        controller: 'TaskListCtrl'
      }).
      when('/caseoverview', {
        templateUrl: 'templates/overview/pageCaseOverview.html',
        controller: 'CaseOverviewCtrl'
      }).
      when('/settings', {
        templateUrl: 'templates/settings/pageSettings.html',
        controller: 'SettingsCtrl'
      }).
      otherwise({
        redirectTo: '/'
      });
  }
]);

angular.module('trckr').filter('object2Array', function() {
  return function(input) {
    return _.toArray(input);
  };
});

/**
 * Calculate number of minutes in formatted time (00:10).
 */
function get_minutes_from_time(time) {
  var split_time = time.split(':');

  return (parseInt(split_time[0]) * 60) + parseInt(split_time[1]);
}

/**
 * Format pretty time info hh:mm from minutes.
 */
function format_minutes_to_time(minutes) {
  if (isNaN(minutes)) {
    return;
  }

  time_hours = Math.floor(minutes / 60);
  if (time_hours < 10) {
    time_hours = "0" + time_hours;
  }

  time_minutes = Math.ceil(minutes % 60);
  if (time_minutes < 10) {
    time_minutes = "0" + time_minutes;
  }

  return time_hours + ':' + time_minutes;
}

function calculate_total_for_task(task) {
  var total_diff = calculate_total_minutes_for_task(task);

  return format_minutes_to_time(total_diff);
}

function calculate_total_minutes_for_task(task) {
  var total_diff = 0;
  angular.forEach(task.time_entries, function(value, key) {
    var minutes = calculate_minutes_for_time_entry(value);
    total_diff += minutes;
  });

  return total_diff;
}

function calculate_minutes_for_time_entry(time_entry) {
  var start = XDate(time_entry.start);

  var stop = XDate();
  if (time_entry.stop) {
    stop = XDate(time_entry.stop);
  }

  var minutes = 0;
  var diff = Math.floor(start.diffMinutes(stop));
  if (!isNaN(diff)) {
    minutes = diff;
  }

  return minutes;
}

/**
 * Mousetrap stuff
 */
Mousetrap.bind(['command+n', 'ctrl+n'], function(e) {
  $('#js-add-task').click();
  return false;
});


