/**
 * trackerService.js
 */
trckrApp.factory('trackerService', ['$rootScope', function ($rootScope) {
  var service = {
    // Storage for all trackers
    trackers: {},

    // Add tracker
    addTracker: function(tracker){
      if(!tracker.input){
        return;
      }
      // Make sure we dont have two active trackers.
      service.stopTracker();

      var time = 0;
      var input = tracker.input;

      if(input[0] === "-"){
        var i = input.split(" ");
        time = i[0].replace("-", "") * 1000 * 60;
        i.splice(0, 1);
        // Replace initial value with task name
        input = i.join(" ");
      }

      // Tracker info
      var name = input;
      var client = tracker.client ;
      
      var start = new Date().getTime();

      service.trackers[start] = {
        name: name,
        client: client,
        start: start,
        timestamp: start,
        time: time,
        active: true
      };

      saveTrackers(service.trackers);
    },

    // Start selected tracker in list.
    startTracker: function(tracker){
      service.stopTracker();

      // Activate chosen tracker.
      service.trackers[tracker.timestamp].active = true;
      service.trackers[tracker.timestamp].start = new Date().getTime();

      saveTrackers(service.trackers);
    },

    // Stop tracker.
    stopTracker: function(){

      angular.forEach(service.trackers, function(tracker, key){

        if( tracker.active ){
          var time = new Date().getTime() - tracker.start;
          service.trackers[key].active = false;
          service.trackers[key].time += time;
        }
      });
      saveTrackers(service.trackers);
    },

    updateTrackers: function(){
      saveTrackers(service.trackers);
    },

    // Delete tracker.
    deleteTracker: function(tracker){
      deleteTracker(tracker.timestamp);
      delete service.trackers[tracker.timestamp];
    },

    getTrackers: function(){
      loadTrackers(service.populateTrackers);
  
      return service.trackers;
    },

    // Callback for saving trackers to model
    populateTrackers: function(data){
      angular.forEach(data, function(tracker, key){
        service.trackers[key] = tracker;
      });
      $rootScope.$broadcast('updateList');
    }
  };

  return service;
}]);
