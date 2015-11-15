;(function() {
  'use strict';

  angular
    .module('app')
    .controller('LoginController', LoginController);

  LoginController.$inject = ['$rootScope', '$state', '$localForage', 'LoopBackAuth', 'Member'];

  function LoginController($rootScope, $state, $localForage, LoopBackAuth, Member){
    var _this = this;

    addLoginJquery();

    this.login = {};

    this.submitLogin = submitLogin;

    function submitLogin() {
      loginUser(_this.login)
        .then(function(){
          $state.go('forum');
        });
    }

    function loginUser(loginFields){
      return Member.login(loginFields).$promise
        .then(function(response){
          LoopBackAuth.currentUserId = response.userId;
          LoopBackAuth.accessTokenId = response.id;
          LoopBackAuth.save();

          $rootScope.currentUser = response.user;

          return $localForage.setItem('currentUser', response.user);
        });
    }

  }

})();
