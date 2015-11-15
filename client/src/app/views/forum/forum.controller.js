;(function() {
  'use strict';

  angular
    .module('app')
    .controller('ForumController', ForumController);

  ForumController.$inject = [];

  function ForumController(){
    var _this = this;
    var topicModal = $('#NewTopic');

    this.newTopicModal = newTopicModal;

    function newTopicModal(){
      topicModal.openModal();
    }


  }

})();
