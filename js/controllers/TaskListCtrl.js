/**
 * Task List controller.
 */
angular.module('trckr').controller('TaskListCtrl', function($scope, $timeout, $http, $modal, dbService, $rootScope) {
  $scope.dateFrom = new Date();
  $scope.dateTo = new Date();
  $scope.alwaysIncludeUnregistered = true;
  $scope.rowDate = '';

  var timeFrom = 0;
  var timeTo = 0;

  $scope.$watch('dateFrom', function(){
    dateFrom = new XDate($scope.dateFrom);
    dateTo = new XDate($scope.dateTo);
    timeFrom = dateFrom.clearTime().getTime();
    timeTo = dateTo.setHours(23).setMinutes(59).getTime();

    if (dateFrom.diffMinutes(dateTo) < 0) {
      $scope.dateTo = dateFrom;
    }

    getTasks(timeFrom, timeTo);
  });

  $scope.$watch('dateTo', function(){
    dateFrom = new XDate($scope.dateFrom);
    dateTo = new XDate($scope.dateTo);
    timeFrom = dateFrom.clearTime().getTime();
    timeTo = dateTo.setHours(23).setMinutes(59).getTime();

    if (dateFrom.diffMinutes(dateTo) < 0) {
      $scope.dateFrom = dateTo;
    }

    getTasks(timeFrom, timeTo);
  });

  function getTasks(timeFrom, timeTo) {
    var unregistered = $scope.alwaysIncludeUnregistered;
    dbService.getTasks(timeFrom, timeTo, unregistered).then(function(data){
      $scope.tasks = {};
      $scope.tasks = data;
    });
  }

  $scope.$on('addedTask', function(event){
    getTasks(timeFrom, timeTo);
  });

  $scope.showDate = function(task) {
    date = new XDate(task.created).toString('dd/MM/yy');
    if (date !== $scope.rowDate) {
      $scope.rowDate = date;

      return true;
    }
    return false;
  };

  $scope.resetDate = function() {
    $scope.dateFrom = new Date();
    $scope.dateTo = new Date();
  };

  $scope.startTask = function(task_id) {
    dbService.startTime(task_id);
    clearTimeout($scope.reminder);
  };

  $scope.stopTask = function(task_id) {
    angular.forEach($scope.tasks[task_id].time_entries, function(value, key){
      if (value.stop === undefined) {
        $scope.tasks[task_id].time_entries[key].stop = new Date().getTime();
      }
    });
    dbService.endAllTimeEntries();
    // Remind us to track time every 10th minute if timer is not running
    $scope.reminder = setInterval(function() {
      var notificationOptions = {
        body: "Du har ikke tracket din tid de sidste 10 minutter"
      };

      var notification = new Notification("Husk at tracke din tid", notificationOptions);
      notification.onclick = function () {
        gui.Window.get();
      }
    }, 1000 * 60 * 10);
  };

  // Send the task object to the modal
  $scope.editTask = function(task) {
    var modalInstance = $modal.open({
      templateUrl: 'templates/add/modalAddTask.html',
      controller: 'ModalCreateCtrl',
      size: 'lg',
      resolve: {
        task: function () {
          return task;
        }
      }
    });
    modalInstance.result.then(function (selectedItem) {
      setTimeout(function(){
        $rootScope.$broadcast('addedTask');
      }, 200);
    }, function () {
    });
  };

  $scope.deleteTask = function(task_id) {
    dbService.deleteTask(task_id);
  };

  $scope.registerTask = function(task) {
    $scope.tasks[task.id].saving_to_crm = true;
    dbService.registerTask(task).then(function(data){
      if (data.registered) {
        $scope.tasks[task.id].saving_to_crm = false;
      }
    });
  };

  $scope.listTotal = function() {
    var total_minutes = 0;

    angular.forEach($scope.tasks, function(task, key) {
      total_minutes += calculate_total_minutes_for_task(task);
    });

    return format_minutes_to_time(total_minutes);
  };

  $scope.timeTotal = function(task) {
    return calculate_total_for_task(task);
  };

  // Refresh page, make the counter run.
  function fireDigest() {
      $timeout(fireDigest, 1500);
  }
  fireDigest();
});
