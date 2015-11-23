;(function() {
  'use strict';

  angular
    .module('app')
    .directive('topicItem', TopicItem);

  TopicItem.$inject = ['$state', '$localForage', 'Topic'];

  function TopicItem($state, $localForage, Topic) {
    var directive = {
      restrict: 'E',
      transclude: true,
      templateUrl: 'app/components/topicItem/topicItem.html',
      scope: {
        topic: '=',
        user: '='
      },
      controller: controller
    };

    return directive;

    function controller($scope){

      $scope.deleteMe = function($event) {
        $event.stopPropagation();

        if ($scope.user.id === $scope.topic.member.id) {
          swal({
            title: 'Are you sure?',
            text: 'You will not be able to recover this topic. It will be gone forever!',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ff3B33',
            confirmButtonText: 'Delete',
            cancelButtonText: 'Cancel',
            closeOnConfirm: true,
            closeOnCancel: true
          }, function(isConfirm){
            if (isConfirm) {
              Topic.prototype$updateAttributes({id: $scope.topic.id},{deleted: true})
                .$promise
                .then(function(topic){
                  swal("Deleted", "Successfully deleted topic", "success");
                })
                .catch(function(err){
                  swal("Error", "Unable to delete topic", "error");
                  console.log(err);
                });
            }
          });
        }
      };

      $scope.goToTopic = function() {
        $state.go('topic', {id: $scope.topic.id});
      };

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
