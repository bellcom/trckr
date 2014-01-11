/**
 * editTracker.js
 */
trckrApp.directive('editTracker', function($compile){
  return {
    restrict: 'E',
    link: function(scope, element, attr){
      $(element).hide();
      scope.$watch('editTracker', function(newVal, oldVal){
        if(newVal){
          $(element).show();
        }
        else {
          $(element).hide();
        }
      });
    },
    templateUrl: 'tpl/editTracker.html'
  };
});


