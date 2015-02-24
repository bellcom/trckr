angular.module('trckr')
  .controller('FaciendoCtrl', ['$scope', '$http', '$interval', function($scope, $http, $interval) {

    function authenticateDrupal() {
      var drupal = new Drupal();

      drupal.setRestPath(localStorage.intranetUrl + '/', "faciendo");

      drupal.login(localStorage.intranetUsername, localStorage.intranetPassword,
          function(userData) {
              console.log('User ' + userData.uid + ' has logged in.');
          },
          function(err){
              console.log('login failed.');
          }
      );
    }
    authenticateDrupal();

    function resetInput() {
      $scope.input = {};
      $scope.input.Date = new Date();
      $scope.tempDate = '';
    }
    resetInput();

    function loadTasks() {
      $http.get(localStorage.intranetUrl + '/mytinytodo/ajax?loadTasks&sort=1&list=' + localStorage.faciendoListId)
        .then(function(res){
          $scope.tasks = res.data.list;
        });
    }
    loadTasks();

    $interval(function(){
      loadTasks();
      authenticateDrupal();
    }, 1000 * 60 * 5);


    $http.get(localStorage.intranetUrl + '/mytinytodo/ajax?tagCloud&list=' + localStorage.faciendoListId)
      .then(function(res){
        $scope.tags = res.data.cloud;
      });

    $scope.showDate = function(task) {
      date = new XDate(task.duedate).toString('dd/MM/yy');
      if (date !== $scope.rowDate) {
        $scope.rowDate = date;

        return true;
      }
      return false;
    };

    $scope.parseDateString = function() {
      $scope.input.Date = fuzzyDate($scope.tempDate);
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
      xdate = new XDate($scope.input.Date);
      var duedate = (xdate.getMonth() + 1)  + '/' + xdate.getDate() + '/' + xdate.getFullYear();

      var data = {
        list: localStorage.faciendoListId,
        title: $scope.input.Task,
        note: $scope.input.Note,
        duedate: duedate,
        tags: $scope.input.Tags,
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

      // Send the task to faciendooook
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
  }]);
