/**
 * OverviewCtrl.js
 */
function OverviewCtrl($scope, $timeout, $rootScope, overviewService){
  // Set up datepickers.
  $scope.to_date = new Date();
  // Crazy oneliner for "yesterday".
  $scope.from_date = new Date(new Date().setDate(new Date().getDate()-1));

  updateOverview();
  
  $scope.clients = [];
  utils.get_clients(function(data){
    for(var key in data){
      $scope.clients.push( {id: data[key].id, name: data[key].name} );
    }
  });

  $scope.task_type = [];
  $scope.task_type.push( {id: 17, name: 'Udvikling'} );
  $scope.task_type.push( {id: 10, name: 'Møde'} );
  $scope.task_type.push( {id: 15, name: 'Aften support'} );

  // Event handlers. ->
  var updateOverviewTimeout = null;
  $rootScope.$on('updateOverview', function(){
    clearTimeout(updateOverviewTimeout);
    updateOverviewTimeout = setTimeout(function(){
      $scope.$apply(function(){
        $scope.trackers = overviewService.getTrackers();
      });
    }, 200);
  });

  $scope.$watch('from_date', function(newVal, oldVal){
    if(newVal !== oldVal){
      updateOverview();
    }
  });

  $scope.$watch('to_date', function(newVal, oldVal){
    if(newVal !== oldVal){
      updateOverview();
    }
  });
  // <- Event handlers.

  // Mappings. ->
  $scope.register = function(tracker){
    overviewService.register(tracker);
  };

  $scope.saveTrackers = function(tracker){
    // Update the time in ms from user input;
    if(tracker !== undefined && tracker.formatted_time !== undefined){
      tracker.time = utils.get_ms(tracker.formatted_time);
      tracker.start = new Date().getTime();
    }
    overviewService.updateTrackers();
  };
  
  $scope.setTime = function(tracker){
    tracker.formatted_time = utils.format_time(utils.get_time(tracker));
  };

  $scope.updateOverview = function(){
    updateOverview();
  };
  // <- Mappings.

  // Functions. ->
  $scope.time = function(tracker){
    return utils.format_time(utils.get_time(tracker));
  };

  function updateOverview() {
    // Set up time on dates.
    // So we show from midnight to midnight on chosen dates.
    var d = new Date(),
        msSinceMidnight = d.getTime() - d.setHours(0,0,0,0),
        from_date = $scope.from_date.getTime() - msSinceMidnight;
        to_date = $scope.to_date.setHours(23, 59, 0, 0);

    overviewService.setOverviewDate(from_date, to_date);
    $scope.trackers = overviewService.getTrackers();
  }
  // <- Functions.
}
