angular.module('trckr').controller('SettingsCtrl', function($scope) {
  // Quick and dirty display of version read from the package.json file.
  fs = require('fs');
  fs.readFile('package.json','utf8', function (err, data) {
    if (err) throw err;
    var package = JSON.parse(data);

    $scope.version = package.version;
    $scope.$apply();
  });

  $scope.trckrServer = localStorage.trckrServer;
  $scope.crmEndpoint = localStorage.crmEndpoint;
  $scope.crmUsername = localStorage.crmUsername;
  $scope.crmPassword = localStorage.crmPassword;

  $scope.intranetUrl = localStorage.intranetUrl;
  $scope.faciendoListId = localStorage.faciendoListId;
  $scope.alwaysShowFaciendo = localStorage.alwaysShowFaciendo === "true";
  $scope.intranetUsername = localStorage.intranetUsername;
  $scope.intranetPassword = localStorage.intranetPassword;

  $scope.saveSettings = function() {
    localStorage.trckrServer = $scope.trckrServer;
    localStorage.crmEndpoint = $scope.crmEndpoint;
    localStorage.crmUsername = $scope.crmUsername;
    localStorage.crmPassword = $scope.crmPassword;

    localStorage.intranetUrl      = $scope.intranetUrl;
    localStorage.faciendoListId   = $scope.faciendoListId;
    localStorage.alwaysShowFaciendo = $scope.alwaysShowFaciendo;
    localStorage.intranetUsername = $scope.intranetUsername;
    localStorage.intranetPassword = $scope.intranetPassword;

    // Reload app
    win.reloadDev();
  };
});
