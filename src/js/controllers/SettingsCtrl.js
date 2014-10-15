angular.module('trckr').controller('SettingsCtrl', function($scope) {

  $scope.trckrServer = localStorage.trckrServer;
  $scope.crmEndpoint = localStorage.crmEndpoint;
  $scope.crmUsername = localStorage.crmUsername;
  $scope.crmPassword = localStorage.crmPassword;


  $scope.saveSettings = function() {
    localStorage.trckrServer = $scope.trckrServer;
    localStorage.crmEndpoint = $scope.crmEndpoint;
    localStorage.crmUsername = $scope.crmUsername;
    localStorage.crmPassword = $scope.crmPassword;
  };
});
