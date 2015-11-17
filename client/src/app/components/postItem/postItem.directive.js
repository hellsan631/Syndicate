;(function() {
  'use strict';

  angular
    .module('app')
    .directive('postItem', PostItem);

  PostItem.$inject = [];

  function PostItem() {
    var directive = {
      restrict: 'E',
      transclude: true,
      templateUrl: 'app/components/postItem/postItem.html',
      scope: {
        post: '=',
        topic: '='
      }
    };

    return directive;

  }

})();
