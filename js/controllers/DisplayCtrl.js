angular.module('trckr')
  .controller('DisplayCtrl', ['$scope', '$http', '$interval', '$rootScope', 'dbService', 'extService', function($scope, $http, $interval, $rootScope, dbService, extService) {

    $scope.lists = [
      {
        id: 3,
        name: 'Jørn Skifter Andersen'
      },
      {
        id: 4,
        name: 'Henrik Farre'
      },
      {
        id: 8,
        name: 'Franz Skaaning'
      },
      {
        id: 10,
        name: 'Morten Hansen'
      },
      {
        id: 13,
        name: 'Thomas Thune Hansen'
      },
      {
        id: 25,
        name: 'Hanne Grave'
      },
      {
        id: 33,
        name: 'Morten Nissen'
      },
      {
        id: 35,
        name: 'Per Okkels'
      },
    ];

    $scope.currentPage = 1;
    $scope.itemPerPage = 3;
    $scope.totalItems = $scope.lists.length;
    $scope.colSize = 12 / $scope.itemPerPage;

    $scope.pageChanged = function() {
      console.log(($scope.currentPage - 1) * $scope.itemPerPage);
      $scope.showLists = _.rest($scope.lists, (($scope.currentPage - 1) * $scope.itemPerPage));
      $scope.showLists = _.first($scope.showLists, $scope.itemPerPage);
    };

    $scope.pageChanged();
  }]);
