;(function() {
  'use strict';

  angular
    .module('app')
    .controller('ForumController', ForumController);

  ForumController.$inject = ['$rootScope', '$timeout', '$state', 'createChangeStream', 'Topic', 'Post'];

  function ForumController($rootScope, $timeout, $state, createChangeStream, Topic, Post){
    var _this = this;
    var _topicModal = $('#NewTopic');

    _this.topics = [];

    _this.newTopicModal   = newTopicModal;
    _this.createNewTopic  = createNewTopic;
    _this.goToTopic       = goToTopic;

    syncTopics();

    function syncTopics(){
      var src = new EventSource('/api/Topics/change-stream?_format=event-stream');
      var changes = createChangeStream(src);
      var live;

      getTopics();

      changes.on('data', function(msg) {
        $timeout(function(){
          getTopics();
        }, 250);
      });
    }

    function getTopics() {
      Topic.find({filter: {include: ['member', 'original']}}).$promise
        .then(filterNewResults);
    }

    function filterNewResults(results) {
      results.forEach(function(result){
        var dupe = false;

        if (_this.topics.length > 0){
          _this.topics.forEach(function(topic, index){
            if (result.id === topic.id) {
              dupe = true;

              if (unixTime(result.lastUpdated) !== unixTime(topic.lastUpdated)) {
                _this.topics[index] = result;
              }
            }
          });
        }

        if (!dupe) {
          _this.topics.push(result);
        }

      });
    }

    function unixTime(date) {
      return Date.parse(date)/1000;
    }

    function goToTopic(id) {
      $state.go('topic', {id: id});
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
