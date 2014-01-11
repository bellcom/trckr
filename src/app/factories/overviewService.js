/**
 * overviewService.js
 */
trckrApp.factory('overviewService', ['$rootScope', '$http', function ($rootScope, $http) {
  var service = {
    trackers: {},
    chart_data: {},

    getTrackers: function(){
      return service.trackers;
    },

    setOverviewDate: function(from_date, to_date){
      service.trackers = {};
      loadTrackers(service.populateTrackers, from_date, to_date);
  
      return service.trackers;
    },

    // Callback for saving trackers to model
    populateTrackers: function(data){
      angular.forEach(data, function(tracker, key){
        service.trackers[key] = tracker;
        service.trackers[key].task_type = 17;
        utils.map_client(tracker.client, service.mapClientCallback, tracker.timestamp);
      });
      $rootScope.$broadcast('updateOverview');
    },

    mapClientCallback: function(id, timestamp){
      service.trackers[timestamp].client_id = id;
      $rootScope.$broadcast('updateOverview');
    },

    updateTrackers: function(){
      saveTrackers(service.trackers);
    },

    register: function(tracker){
      tracker.register_progress = true;
      var url = conf.get('url');

      var data = {
        login: {
          user: conf.get('user'),
          pass: conf.get('pass')
        },
        tracker: tracker
      };

      $http.post(url + '?q=register', data).success(function(data){
        if(data.status === "success"){
          service.trackers[tracker.timestamp].register_progress = false;
          service.trackers[tracker.timestamp].registerstatus = data.status;
          service.trackers[tracker.timestamp].registermessage = data.message;
          service.updateTrackers();
          $rootScope.$broadcast('updateOverview');
        }
      });
    },

    getChart: function(){
      var labels = [];
      var datasets = [{
          fillColor : "rgba(151,187,205,0)",
          strokeColor : "#f1c40f",
          pointColor : "rgba(151,187,205,0)",
          pointStrokeColor : "#f1c40f",
          data : []
        }];

      var temp_data = {};

      angular.forEach(service.overview, function(tracker, key){
        var date = new Date(parseInt(tracker.timestamp)).getDate();
        var month = new Date(parseInt(tracker.timestamp)).getMonth() + 1;
        var label = (date + '/' + month);

        if(labels.indexOf(label) == -1){
          labels.unshift(label);
        }

        if(typeof temp_data[label] === 'undefined'){
          temp_data[label] = {time: tracker.time};
        }
        temp_data[label].time += tracker.time;

      });

      angular.forEach(temp_data, function(data, key){
        datasets[0].data.unshift((data.time / 1000 / 60 /60));
      });

      return {labels: labels, datasets: datasets};
    }
  };

  return service;
}]);
