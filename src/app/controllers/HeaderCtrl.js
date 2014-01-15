function HeaderCtrl($scope, $location, $rootScope, $timeout, overviewService){

  // Set up -->>
  $scope.tracker = {};

  var loadTrackersCallback = function(trackers){

    for(var key in trackers){
      if(trackers[key].active === true){
        var d = new Date();
        d.setTime(conf.get('window_close'));
        $scope.tracker = JSON.parse(JSON.stringify(trackers[key]));
        $scope.tracker.forgot = true;
        $scope.tracker.close = d.getHours() + ":" + d.getMinutes();
        $scope.tracker.formatted_time = utils.format_time(utils.get_time(trackers[key], conf.get('window_close')));
      }
    }
  };

  var d = new Date(),
      msSinceMidnight = d.getTime() - d.setHours(0,0,0,0),
      yesterday = new Date(new Date().setDate(new Date().getDate()-1)),
      day_before_yesterday = new Date(new Date().setDate(new Date().getDate()-2)),
      from_date = day_before_yesterday.getTime() - msSinceMidnight,
      to_date = yesterday.setHours(23, 59, 0, 0);

  loadTrackers(loadTrackersCallback, from_date, to_date);

  // Detect if the app is suspended
  conf.set('suspend_time', new Date().getTime());

  var suspend_check = function(){
    $timeout(function(){
      now = new Date().getTime();
      if((now - 5000) < conf.get('suspend_time'))
      {
        conf.set('suspend_time', now);
        conf.set('window_close', now);
      }
      else {
        $scope.$apply(function(){
          $scope.suspend = true; 
          loadTrackers(loadTrackersCallback, from_date);
          $rootScope.$broadcast('reloadList');
        });
      }

      suspend_check();
    }, 500);
  };
  
  suspend_check();
  // <<-- Set up

  // Binding -->
  $scope.saveTrackers = function(tracker){
    if(tracker !== undefined && tracker.formatted_time !== undefined){
      tracker.time = utils.get_ms(tracker.formatted_time);
      tracker.start = new Date().getTime();
    }
    tracker.forgot = "";
    tracker.active = false;
    saveTracker(1, tracker);
    $rootScope.$broadcast('updateList');
  };

  $scope.ignoreSuspend = function(){
    $scope.tracker.forgot = false;
    conf.set('suspend_time', new Date().getTime());
  };
  // <<-- Binding

  // Functions -->
  $scope.isActive = function (viewLocation) { 
    return viewLocation === $location.path();
  };
  // <<-- Functions
}
