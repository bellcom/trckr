/**
 * ListCtrl.js
 */
function ListCtrl($scope, $modal,  $timeout, $rootScope, $log, trackerService){
  $scope.trackers = trackerService.getTrackers();

  $rootScope.$on('updateList', function(){
    $scope.$apply();
  });

  // Regularly update $scope
  var reload = function(){$timeout(function(){
      $scope.$apply();
      reload();
    }, 30000);
  }

  reload();

  // Mappings. ->
  $scope.stop = function(tracker){
    trackerService.stopTracker();
  }

  $scope.start = function(tracker){
    trackerService.startTracker(tracker);
  }

  $scope.del = function(tracker){
    trackerService.deleteTracker(tracker);
  }

  $scope.saveTrackers = function(tracker){
    // Update the time in ms from user input;
    if(tracker !== undefined && tracker.formatted_time !== undefined){
      tracker.time = utils.get_ms(tracker.formatted_time);
      tracker.start = new Date().getTime();
    }
    trackerService.updateTrackers();
  }

  $scope.setTime = function(tracker){
    tracker.formatted_time = utils.format_time(utils.get_time(tracker));
  }
  // <- Mappings.

  // Functions. ->
  // Format time for tracker
  $scope.time = function(tracker){
    return utils.format_time(utils.get_time(tracker));
  }

  $scope.timeTotal = function(){
    var total_time = 0;

    angular.forEach($scope.trackers, function(tracker, key){
      total_time += utils.get_time(tracker);
    });

    return utils.format_time(total_time);
  }
  // <- Functions.
}


