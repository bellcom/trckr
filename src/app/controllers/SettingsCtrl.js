/**
 * SettingsCtrl.js
 */
function SettingsCtrl($scope){
  $scope.settingsUser = conf.get('user', '');
  $scope.settingsPass = conf.get('pass', '');
  $scope.settingsURL = conf.get('url', '');
  $scope.settingsNotifyEn = conf.get('notify_enable', 0);
  $scope.settingsNotifyInt = conf.get('notify_interval', 3);

  $scope.saveSettings = function(){
    conf.set('user', $scope.settingsUser);
    conf.set('pass', $scope.settingsPass);
    conf.set('url', $scope.settingsURL);
    conf.set('notify_enable', $scope.settingsNotifyEn);
    // Handle if user inputs something other than an integer.
    $scope.settingsNotifyInt = parseInt($scope.settingsNotifyInt); 
    conf.set('notify_interval', $scope.settingsNotifyInt);

    win.reloadDev();
  };
}
