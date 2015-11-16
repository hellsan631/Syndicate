;(function() {
  'use strict';

  angular
    .module('app')
    .directive('topicItem', TopicItem);

  TopicItem.$inject = [];

  function TopicItem() {
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

    function controller($scope) {

    }

  }

})();
