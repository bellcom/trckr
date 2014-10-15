angular.module('trckr')
  .factory('extService', ['$q', '$http', function($q, $http) {

    var login = {
      login: {
        endpoint: localStorage.crmEndpoint,
        user: localStorage.crmUsername,
        pass: localStorage.crmPassword
      }
    };

    var extService = {
      getCases: function() {
        var deferred = $q.defer();

        $http.post(localStorage.trckrServer + '/trckr.php?q=getCases', login)
          .success(function(data) {
            deferred.resolve(data);
          });

        return deferred.promise;
      },
      getStoryInfo: function(project_slug, story_id) {
        var deferred = $q.defer();

        $http.post(localStorage.trckrServer + '/get_task_info.php?project_slug=' + project_slug + '&story_id=' + story_id, login)
          .success(function(data) {
          deferred.resolve(data);
        });

        return deferred.promise;
      },
      getCaseInfo: function(case_id, task) {
        var deferred = $q.defer();
        var task_encoded = encodeURIComponent(task);

        $http.post(localStorage.trckrServer + '/get_case_entries.php?case_id=' + case_id + '&search_string=' + task_encoded, login)
          .success(function(data) {
            deferred.resolve(data);
          });

        return deferred.promise;
      },
      getTasks: function(){
        var deferred = $q.defer();
        $http.post(localStorage.trckrServer + '/task_json.php', login)
          .success(function(data) {
            deferred.resolve(data);
          });

        return deferred.promise;
      }
    };

    return extService;
  }
]);
