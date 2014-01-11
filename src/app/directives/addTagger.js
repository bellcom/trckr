trckrApp.directive('typeaheadtagger', function($log){
    return {
      link: function(scope, element, attrs) {
        var id = Math.floor((Math.random()*1000)+1);
        element.addTagger(attrs.typeaheadtagger, id);

        element.bind('tagger:select', function(object, data){
          if(data.id === id){
            if(data.text.indexOf('@') === -1 && scope.tracker !== undefined){
              scope.$apply(function() {
                  scope.tracker.client = data.text;
              });
            }
            if(scope.tracker !== undefined){
              scope.$apply(function() {
                  scope.tracker.input = data.text;
              });
            }
          }
        });
      }
    };
  });
