/**
 * Controller for task creation
 */
angular.module('trckr').controller('ModalCreateCtrl', function($scope, $http, $modalInstance, task, dbService, extService) {
  // Define tabs in modal.
  // They all share this controller.
  $scope.tabs = [
    {title: 'Add task', icon: 'edit', template: 'templates/add/tabAddTask.html' },
    {title: 'Task overview', icon: 'time', template: 'templates/add/tabTaskOverview.html' },
    {title: 'Case overview', icon: 'list', template: 'templates/add/tabCaseOverview.html' },
  ];

  // Set task form dbService, if its not new.
  $scope.task = {};
  if (dbService.tasks[task.id] !== undefined){
    $scope.task = dbService.tasks[task.id];
  }

  $scope.$watch('time_used_minutes', function() {
    calculatePercentage();
    $scope.time_used_formatted = format_minutes_to_time($scope.time_used_minutes);
  });

  $scope.$watch('task_estimate', function() {
    calculatePercentage();
  });

  $scope.$watch('percent_used', function() {
    if (isNaN($scope.time_used) || $scope.time_used === 0) {
      $scope.alert = {
        show: false,
        type: 'success'
      };
    }
    if ($scope.percent_used < 80) {
      $scope.alert = {
        show: false,
        type: 'success'
      };
    }
    else if ($scope.percent_used >= 80 && $scope.percent_used < 99) {
      $scope.alert = {
        show: true,
        type: 'warning',
        msg: $scope.percent_used + "% brugt"
      };
    }
    else if ($scope.percent_used >= 100) {
      $scope.alert = {
        show: true,
        type: 'danger',
        msg: "Tiden er brugt"
      };
    }
  });

  function calculatePercentage() {
    $scope.percent_used = Math.round($scope.time_used_minutes / ($scope.task_estimate * 60) * 100);
    if (isNaN($scope.percent_used)) {
      $scope.percent_used = 0;
    }
  }

  $scope.stories = [];
  $scope.cases = [];

  extService.getTasks().then(function(data){
    $scope.stories = data;
  });

  extService.getCases().then(function(data){
    $scope.cases = data;
  });

  $scope.selectStory = function($item, $model, $label) {
    var project_slug = $item.project_slug;
    var story_id = $item.story_id;
    if ($item.estimate === undefined) {
      extService.getStoryInfo(project_slug, story_id)
        .then(function(data){
          $scope.task_estimate = data;
        });
    }
    $scope.task_estimate = $item.estimate;
  };

  $scope.selectCase = function($item, $model, $label, task) {
    var case_id = $item.case_id;
    $scope.task.case_id = case_id;

    extService.getCaseInfo(case_id, task.task)
      .then(function(data){
        $scope.time_used_minutes = data.total_time_length_minutes;
        $scope.time_used_formatted = format_minutes_to_time(data.total_time_length_minutes);
        $scope.case_items = data.items;
      });
  };

  $scope.saveTimeEntry = function(time_entry) {
    var minutes = get_minutes_from_time(time_entry.duration_formatted);

    var start_split = time_entry.start_formatted.split(' ');
    var start_time_split = start_split[0].split(':');
    var start_date_split = start_split[1].split('/');

    var start = XDate(start_date_split[2], start_date_split[1] - 1, start_date_split[0], start_time_split[0], start_time_split[1], start_time_split[2]).getTime();

    var stop = XDate(start).addMinutes(minutes).getTime();

    $scope.task.time_entries[time_entry.id].start = start;
    $scope.task.time_entries[time_entry.id].stop = stop;

    dbService.updateTimeEntry(start, stop, time_entry.id);

    $scope.format();
  };

  $scope.formatDate = function(timestamp) {
    if (timestamp < 2000000000) {
      timestamp = timestamp * 1000;
      return new XDate(timestamp).toString('H:mm:ss dd/MM/yy');
    }
  };

  $scope.deleteTimeEntry = function(time_entry) {
    dbService.deleteTimeEntry(time_entry.task_id, time_entry.id);
  };

  $scope.format = function formatTimeEntries() {
    $scope.task.total_duration = calculate_total_for_task($scope.task);

    angular.forEach($scope.task.time_entries, function(time_entry, key){
      $scope.task.time_entries[key].duration_formatted = format_minutes_to_time(calculate_minutes_for_time_entry(time_entry));
      $scope.task.time_entries[key].start_formatted = new XDate(time_entry.start).toString('H:mm:ss dd/MM/yy');
      if (time_entry.stop !== undefined) {
        $scope.task.time_entries[key].stop_formatted = new XDate(time_entry.stop).toString('H:mm:ss dd/MM/yy');
      }
    });
  };
  $scope.format();

  $scope.ok = function() {
    dbService.saveTask($scope.task);
    $modalInstance.close("info sent from modal");
  };

  $scope.cancel = function() {
    $modalInstance.close();
  };

  $scope.prepareRegisterEdit = function() {
    $scope.register = {};
    $scope.register.timeLength = angular.copy($scope.task.register_info.time_length);
    $scope.register.caseName = angular.copy($scope.task.case_name);
    $scope.register.id = angular.copy($scope.task.register_info.sugar_id);
    $scope.register.case_id = angular.copy($scope.task.register_info.case_id);
    $scope.register.date = $scope.formatDate($scope.task.register_info.date_entered);
    $scope.register.task_id = $scope.task.id;
  };

  $scope.selectRegisterCase = function($item, $model, $label, task) {
    var case_id = $item.case_id;
    var name = $item.name;
    $scope.register.case_id = case_id;

    $scope.task.case_id = case_id;
    $scope.task.case_name = name;
  };

  $scope.updateRegister = function() {
    // Save the new selected case on the task.
    dbService.saveTask($scope.task);

    $scope.saving_to_crm = true;
    var start_split = $scope.register.date.split(' ');
    var start_time_split = start_split[0].split(':');
    var start_date_split = start_split[1].split('/');

    $scope.register.time = XDate('20' + start_date_split[2], start_date_split[1] - 1, start_date_split[0], start_time_split[0], start_time_split[1], start_time_split[2]).getTime();

    dbService.updateRegisterTask($scope.register).then(function(data){
      if (data.registered) {
        $scope.saving_to_crm = false;
      }
    });
  };
});
