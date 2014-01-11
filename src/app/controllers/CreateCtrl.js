/**
 * CreateCtrl.js
 */
function CreateCtrl($scope, trackerService){
  $scope.tracker = "";

  $scope.save = function(){
    trackerService.addTracker($scope.tracker);
    $scope.tracker.input = "";
  };
}


