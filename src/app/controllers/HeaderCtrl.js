function HeaderCtrl($scope, $location, overviewService){
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

  $scope.saveTrackers = function(tracker){
    if(tracker !== undefined && tracker.formatted_time !== undefined){
      tracker.time = utils.get_ms(tracker.formatted_time);
      tracker.start = new Date().getTime();
    }
    tracker.forgot = "";
    tracker.active = false;
    saveTracker(1, tracker);
  };
  

  var d = new Date(),
      msSinceMidnight = d.getTime() - d.setHours(0,0,0,0),
      yesterday = new Date(new Date().setDate(new Date().getDate()-1)),
      day_before_yesterday = new Date(new Date().setDate(new Date().getDate()-2)),
      from_date = day_before_yesterday.getTime() - msSinceMidnight;
      to_date = yesterday.setHours(23, 59, 0, 0);

  loadTrackers(loadTrackersCallback, from_date, to_date);

  $scope.isActive = function (viewLocation) { 
    return viewLocation === $location.path();
  };
}
