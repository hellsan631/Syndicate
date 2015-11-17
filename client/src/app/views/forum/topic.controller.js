;(function() {
  'use strict';

  angular
    .module('app')
    .controller('TopicController', TopicController);

  TopicController.$inject = ['$stateParams', 'createChangeStream', 'Topic'];

  function TopicController($stateParams, createChangeStream, Topic){
    var _this = this;

    syncPosts($stateParams.id);

    function syncPosts(id){
      var src = new EventSource('/api/Topics/change-stream?_format=event-stream');
      var changes = createChangeStream(src);
      var live;

      getTopic(id);

      changes.on('data', function(msg) {
        getTopic(id);
      });
    }

    function getTopic(id) {
      Topic.findById({
          id: id,
          filter: {
            include: {posts: 'member'}
          }
        })
        .$promise
        .then(function(results){
          _this.topic = results;
        });
    }


  }

})();
