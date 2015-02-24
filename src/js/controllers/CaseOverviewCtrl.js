/**
 * Case overview controller.
 */
angular.module('trckr').controller('CaseOverviewCtrl', function($scope, $filter, $http, extService) {
  extService.getCases().then(function(data){
    $scope.cases = data;
  });

  $scope.selectCase = function($item, $model, $label, task) {
    var case_id = $item.case_id;

    extService.getCaseInfo(case_id, 'no_search').then(function(data){
      $scope.case_items = data.items;
      $scope.time_used_minutes = data.total_time_length_minutes;
      $scope.time_used_minutes_formatted = format_minutes_to_time(data.total_time_length_minutes);
      // If not called here, it would first be called when the filter input is changed.
      $scope.calculateTime();
    });
  };

  /**
   * Sum up the time on the items that match the filter
   */
  $scope.calculateTime = function() {
    var items = $filter('filter')($scope.case_items, $scope.query);
    var minutes_total = 0;

    angular.forEach(items, function(value, key) {
      minutes_total = minutes_total + value.time_length_minutes;
    });

    $scope.time_for_filtered = format_minutes_to_time(minutes_total);
  };

  /**
   * Determine if a single item is in the search query
   * if it is, hightligt it
   */
  $scope.highlightItem = function(item) {
    var filter = $filter('filter')([item], $scope.query);

    if (filter.length) {
      return "success";
    }
  };
});

/**
 * Main page controller.
 */
angular.module('trckr').controller('CreateCtrl', function($scope, $http, $modal, $rootScope, dbService) {
  $rootScope.$on('displayError', function(event, data) {
    var modalInstance = $modal.open({
      templateUrl: 'templates/modalError.html',
      controller: 'ModalErrorCtrl',
      size: 'sm',
      resolve: {
        error: function () {
          return data;
        }
      }
    });
  });

  $scope.modal = function() {
    var modalInstance = $modal.open({
      templateUrl: 'templates/add/modalAddTask.html',
      controller: 'ModalCreateCtrl',
      size: 'lg',
      resolve: {
        task: function () {
          return {};
        }
      }
    });
    modalInstance.result.then(function (selectedItem) {
      setTimeout(function(){
        $rootScope.$broadcast('addedTask');
      }, 100);
      $scope.new_task = selectedItem;
    }, function () {
    });
  };
});


angular.module('trckr').controller('ModalErrorCtrl', function($scope, $modalInstance, error) {
  $scope.message = error.message.msg;
});
