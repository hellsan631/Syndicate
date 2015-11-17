;(function() {
  'use strict';

  angular
    .module('app')
    .controller('TopicController', TopicController);

  TopicController.$inject = ['$timeout', '$stateParams', '$localForage', 'createChangeStream', 'Topic'];

  function TopicController($timeout, $stateParams, $localForage, createChangeStream, Topic){
    var _this = this;

    _this.initialized = false;

    syncPosts($stateParams.id);
    $localForage.setItem($stateParams.id, true);

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
        .then(filterNewResults);
    }

    function filterNewResults(results) {
      if (!_this.topic) {
        _this.topic = results;
      } else {
        results.posts.forEach(function(result){
          var dupe = false;

          if (_this.topic.posts.length > 0){
            _this.topic.posts.forEach(function(post, index){
              if (result.id === post.id) {
                dupe = true;
              }
            });
          }

          if (!dupe) {
            _this.topic.posts.push(result);
          }

        });
      }

      if(!_this.initialized) {
        $timeout(function(){
          _this.initialized = true;
        }, 100);
      }

    }

    function unixTime(date) {
      return Date.parse(date);
    }


  }

})();
