;(function() {
  'use strict';

  angular
    .module('app')
    .controller('ForumController', ForumController);

  ForumController.$inject = ['$rootScope', 'LiveSet', 'createChangeStream', 'Topic', 'Post'];

  function ForumController($rootScope, LiveSet, createChangeStream, Topic, Post){
    var _this = this;
    var topicModal = $('#NewTopic');

    _this.newTopicModal = newTopicModal;
    _this.createNewTopic = createNewTopic;

    syncTopics();

    function syncTopics(){
      var src = new EventSource('/api/Topics/change-stream?_format=event-stream');
      var changes = createChangeStream(src);
      var live;

      Topic.find({filter: {include: 'member'}}).$promise
        .then(function(results) {
          live = new LiveSet(results, changes);
          _this.topics = live.toLiveArray();
        });
    }

    function newTopicModal(){
      topicModal.openModal();
    }

    function createNewTopic(){
      _this.topic.personId = _this.post.personId = $rootScope.currentUser.id;

      createTopic(_this.topic)
        .then(createPost)
        .then(function(){
          topicModal.closeModal();
        });
    }

    function createTopic(topic){
      return Topic.create(topic).$promise;
    }

    function createPost(topic){
      _this.post.topicId = topic.id;

      return Post.create(_this.post).$promise;
    }
  }

})();
