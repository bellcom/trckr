/**
 * Task List controller.
 */
angular.module('trckr').controller('TaskListCtrl', function($scope, $timeout, $http, $modal, dbService, $rootScope) {
  $scope.dateFrom = new Date();
  $scope.dateTo = new Date();

  var timeFrom = 0;
  var timeTo = 0;

  $scope.$watch('dateFrom', function(){
    timeFrom = new XDate($scope.dateFrom).clearTime().getTime();
    getTasks(timeFrom, timeTo);
  });

  $scope.$watch('dateTo', function(){
    timeTo = new XDate($scope.dateTo).setHours(23).setMinutes(59).getTime();
    getTasks(timeFrom, timeTo);
  });

  function getTasks(timeFrom, timeTo) {
    dbService.getTasks(timeFrom, timeTo).then(function(data){
      $scope.tasks = {};
      $scope.tasks = data;
    });
  }

  $scope.$on('addedTask', function(event){
    getTasks(timeFrom, timeTo);
  });

  $scope.startTask = function(task_id) {
    dbService.startTime(task_id);
  };

  $scope.stopTask = function(task_id) {
    angular.forEach($scope.tasks[task_id].time_entries, function(value, key){
      if (value.stop === undefined) {
        $scope.tasks[task_id].time_entries[key].stop = new Date().getTime();
      }
    });
    dbService.endAllTimeEntries();
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
      $rootScope.$broadcast('addedTask');
      $scope.new_task = selectedItem;
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

  function fireDigest() {
      $timeout(fireDigest, 30000);
  }
  fireDigest();

});
