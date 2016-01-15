angular.module('trckr')
  .controller('FaciendoCtrl', ['$scope', '$http', '$interval', '$rootScope', 'dbService', 'extService', function($scope, $http, $interval, $rootScope, dbService, extService) {

    $scope.listId = localStorage.faciendoListId;

    extService.getTasks().then(function(data){
      $scope.stories = data;
    });

    $scope.casesIndexed = [];

    function loadCases() {
      extService.getCases().then(function(data) {
        $scope.cases = data;

        angular.forEach(data, function(value, key) {
          $scope.casesIndexed[value.case_id] = value.name;
        });
        angular.forEach($scope.tasks, function(value, key) {
          value.caseName = $scope.casesIndexed[value.taskref];
        });
      });
    }

    function resetInput() {
      $scope.input = {};
      $scope.input.Date = new Date();
    }
    resetInput();

    function loadTasks() {
      $http.get(localStorage.intranetUrl + '/mytinytodo/ajax?loadTasks&sort=1&list=' + $scope.listId)
        .then(function(res){
          console.log(res.data.list);
          $scope.tasks = res.data.list;
        });
      loadCases();
    }
    loadTasks();
    loadCases();

    $interval(function(){
      loadTasks();
    }, 1000 * 60 * 5);

    $http.get(localStorage.intranetUrl + '/mytinytodo/ajax?tagCloud&list=' + $scope.listId)
      .then(function(res){
        $scope.tags = res.data.cloud;
      });

    $scope.startFaciendoTask = function(faciendoTask) {
      var task = {};
      task.task = faciendoTask.title;
      task.description = faciendoTask.tags;
      task.case_id = faciendoTask.taskref;
      task.case_name = faciendoTask.caseName;

      dbService.saveTask(task);
      $rootScope.$broadcast('addedTask');
    };

    $scope.showDate = function(task) {
      date = new XDate(task.duedate).toString('dd/MM/yy');
      if (date !== $scope.rowDate) {
        $scope.rowDate = date;

        return true;
      }
      return false;
    };

    $scope.parseDateString = function() {
      $scope.input.Date = fuzzyDate($scope.input.TempDate);
    };

    $scope.taskEdit = function(task) {

      if ($scope.editTask && $scope.editTask.id === task.id) {
        resetInput();
        $scope.editTask = false;
        return;
      }
      $scope.editTask = task;

      // Create a new date object for the input.
      var dd = task.duedate.split('/');
      var d = new XDate('20' + dd[2], (dd[0] - 1), dd[1]);

      $scope.input.Task = task.title;
      $scope.input.Tags = task.tags;
      $scope.input.Note = task.noteText;
      $scope.input.Date = d;
    };

    $scope.completeTask = function(task) {
      var data = {
        id: task.id,
        compl: 1,
        fid: 1
      };

      var url = localStorage.intranetUrl + '/mytinytodo/ajax?completeTask=' + task.id;
      $http({
          method: 'POST',
          url: url,
          data: $.param(data),
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}
      }).then(function(){
        loadTasks();
      });
    };

    $scope.deleteTask = function(task) {
      var data = {
        id: task.id,
        fid: 1
      };

      var url = localStorage.intranetUrl + '/mytinytodo/ajax?deleteTask=' + task.id;
      $http({
          method: 'POST',
          url: url,
          data: $.param(data),
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}
      }).then(function(){
        loadTasks();
      });
    };

    $scope.saveTask = function() {
      // Hide the add form
      $scope.addFaciendoTask = null;

      xdate = new XDate($scope.input.Date);
      var duedate = (xdate.getMonth() + 1)  + '/' + xdate.getDate() + '/' + xdate.getFullYear();

      var data = {
        list: $scope.listId,
        title: $scope.input.Task,
        note: $scope.input.Note,
        duedate: duedate,
        tags: $scope.input.Tags,
        // Wrong name for the field. But hey, we will manage.
        taskref: $scope.input.CaseId,
        fid: 1
      };

      var url = '';

      if ($scope.editTask) {
        data.id = $scope.editTask.id;
        url = localStorage.intranetUrl + '/mytinytodo/ajax?editTask=' + $scope.editTask.id;
        $scope.editTask = false;
      }
      else {
        url = localStorage.intranetUrl + '/mytinytodo/ajax?fullNewTask';
      }

      // Send the task to faciendo
      $http({
          method: 'POST',
          url: url,
          data: $.param(data),
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}
      }).then(function(){
        loadTasks();
      });

      resetInput();
    };

    $scope.selectCase = function($item, $model, $label, input) {
      input.CaseId = $item.case_id;
    };
  }]);
