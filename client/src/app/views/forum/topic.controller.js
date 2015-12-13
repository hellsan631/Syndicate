;(function() {
  'use strict';

  angular
    .module('app')
    .controller('TopicController', TopicController);

  TopicController.$inject = [
    '$scope', '$rootScope', '$timeout', '$q',
    '$stateParams', '$localForage',
    'createChangeStream', 'Topic', 'Post'];

  function TopicController($scope, $rootScope, $timeout, $q, $stateParams,
    $localForage, createChangeStream, Topic, Post) {

    var _this = this;
    var _postModal = $('#NewPost');

    _this.initialized   = false;
    _this.newPost       = {};
    _this.newPostModal  = newPostModal;
    _this.createNewPost = createNewPost;

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

      $scope.$on('$destroy', function () {
        src.close();
      });
    }

    function newPostModal(quote, username){

      if (quote) {
        _this.newPost.content = '' +
          '<p><blockquote>@' + username + '<br/>' + quote + '</blockquote></p><br/>';
      }

      _postModal.openModal();
    }

    function createNewPost(){
      if(!_this.newPost.content || _this.newPost.content.length === 0) {
        return errorMessage('No Post Content', 'You need to enter in some content to make a topic');
      }

      createPost(_this.topic)
        .then(function(){
          _postModal.closeModal();
          _this.newPost = {};
        });
    }

    function errorMessage(title, text) {
      swal(title, text, 'error');

      return $q(function(){return null;});
    }

    function createPost(topic){
      _this.newPost.topicId = topic.id;
      _this.newPost.memberId = $rootScope.currentUser.id;

      return Post.create(_this.newPost).$promise;
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
      _this.topic = results;

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
