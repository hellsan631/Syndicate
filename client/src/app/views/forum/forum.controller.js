;(function() {
  'use strict';

  angular
    .module('app')
    .controller('ForumController', ForumController);

  ForumController.$inject = ['$rootScope', 'LiveSet', 'createChangeStream', 'Topic', 'Post'];

  function ForumController($rootScope, LiveSet, createChangeStream, Topic, Post){
    var _this = this;
    var _topicModal = $('#NewTopic');

    _this.newTopicModal = newTopicModal;
    _this.createNewTopic = createNewTopic;

    syncTopics();

    function syncTopics(){
      var src = new EventSource('/api/Topics/change-stream?_format=event-stream');
      var changes = createChangeStream(src);
      var live;

      Topic.find({filter: {include: ['member', 'original']}}).$promise
        .then(function(results) {
          live = new LiveSet(results, changes);
          _this.topics = live.toLiveArray();
        });
    }

    function newTopicModal(){
      _topicModal.openModal();
    }

    function createNewTopic(){
      _this.topic.memberId = _this.post.memberId = $rootScope.currentUser.id;

      createTopic(_this.topic)
        .then(createPost)
        .then(function(){
          _topicModal.closeModal();
          _this.topic = {};
          _this.post = {};
        });
    }

    function createTopic(topic){
      return Topic.create(topic).$promise;
    }

    function createPost(topic){
      _this.post.originalId = _this.post.topicId = topic.id;

      return Post.create(_this.post).$promise;
    }
  }

})();
