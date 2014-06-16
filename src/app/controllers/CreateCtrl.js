/**
 * CreateCtrl.js
 */
function CreateCtrl($scope, trackerService){
  $scope.tracker = "";

  $scope.save = function(){
    trackerService.addTracker($scope.tracker);
    $scope.tracker.input = "";
    $scope.tracker.client = "";
  };

  $scope.clients = [];
  utils.get_clients(function(data){
    for(var key in data){
      $scope.clients.push( {id: data[key].id, name: data[key].name} );
    }
  });
}


