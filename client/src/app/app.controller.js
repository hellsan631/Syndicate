;(function() {
  'use strict';

  angular
    .module('app')
    .controller('AppController', AppController);

  AppController.$inject = [
    '$rootScope', '$localForage', 'Member'
  ];

  function AppController($rootScope, $localForage, Member){
    var _this = this;

    Member.getCurrent().$promise
      .then(saveCurrentUser);

    function saveCurrentUser(user) {
      $localForage.setItem('currentUser', user);
      $rootScope.currentUser = user;
    }

  }

})();
