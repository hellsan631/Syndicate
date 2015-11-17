;(function() {
  'use strict';

  angular
    .module('app')
    .directive('topicItem', TopicItem);

  TopicItem.$inject = ['$localForage'];

  function TopicItem($localForage) {
    var directive = {
      restrict: 'E',
      transclude: true,
      templateUrl: 'app/components/topicItem/topicItem.html',
      scope: {
        topic: '='
      },
      controller: controller
    };

    return directive;

    function controller($scope){

      $localForage.getItem($scope.topic.id)
        .then(function(data) {

          if (data) {
            $scope.seen = true;
          } else {
            $scope.seen = false;
          }

        });

    }

  }

})();
