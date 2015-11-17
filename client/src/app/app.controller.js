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
      .then(saveCurrentUser)
      .catch(removeUser);

    function saveCurrentUser(user) {
      if (user) {
        $localForage.setItem('currentUser', user);
        $rootScope.currentUser = user;
      } else {
        removeUser();
      }
    }

    function removeUser() {
      $localForage.removeItem('currentUser');
      $rootScope.currentUser = false;
    }

  }

})();
