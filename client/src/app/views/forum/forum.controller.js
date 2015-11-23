;(function() {
  'use strict';

  angular
    .module('app')
    .controller('ForumController', ForumController);

  ForumController.$inject = ['$rootScope', '$timeout', '$q', 'createChangeStream', 'Topic', 'Post'];

  function ForumController($rootScope, $timeout, $q, createChangeStream, Topic, Post){
    var _this = this;
    var _topicModal = $('#NewTopic');

    _this.topics = [];
    _this.initialized = false;

    _this.newTopicModal   = newTopicModal;
    _this.createNewTopic  = createNewTopic;

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

      if(!_this.initialized) {
        $timeout(function(){
          _this.initialized = true;
        }, 100);
      }

    }

    function unixTime(date) {
      return Date.parse(date);
    }

    function newTopicModal(){
      _topicModal.openModal();
    }

    function createNewTopic(){
      if(!_this.post.content || _this.post.content.length === 0) {
        return errorMessage('No Post Content', 'You need to enter in some content to make a topic');
      }

      _this.topic.memberId = _this.post.memberId = $rootScope.currentUser.id;

      createTopic(_this.topic)
        .then(createPost)
        .then(function(){
          _topicModal.closeModal();
          _this.topic = {};
          _this.post = {};
        });
    }

    function errorMessage(title, text) {
      swal(title, text, 'error');

      return $q(function(){return null;});
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
