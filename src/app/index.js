/**
 * index.js
 */
// Load native UI library
var gui = require('nw.gui'); //or global.window.nwDispatcher.requireNwGui() (see https://github.com/rogerwang/node-webkit/issues/707)

// Get the current window
var win = gui.Window.get();

var trckrApp = angular.module('trackers',  ['ui.bootstrap', 'ngRoute']);

trckrApp.config(['$routeProvider', function($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'tpl/list.html',
    })
    .when('/overview', {
      templateUrl: 'tpl/overview.html',
    })
    .when('/settings', {
      templateUrl: 'tpl/settings.html',
    })
    .otherwise({
      redirectTo: '/'
    });
}]);

trckrApp.filter('filterTrackers', function() {
  return function(items, field){
    if (!field){
      return items;
    }
    var result = [];
    var searchText = field.toLowerCase();

    angular.forEach(items, function(value, key){
      if
      ( value.name.toLowerCase().indexOf(searchText) !== -1 ||
      value.client.toLowerCase().indexOf(searchText) !== -1
      ){
        result.push(value);
      }

    });
    return result;
  };
});

win.on('close', function(){
  conf.set('window_close', new Date().getTime());
  this.close(true);
});
