;(function() {
  'use strict';

  angular
    .module('app')
    .controller('LoginController', LoginController);

  LoginController.$inject = ['$rootScope', '$state', '$localForage', 'LoopBackAuth', 'Member'];

  function LoginController($rootScope, $state, $localForage, LoopBackAuth, Member){
    var _this = this;
    
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
          if (!response.user.banned) {
            LoopBackAuth.currentUserId = response.userId;
            LoopBackAuth.accessTokenId = response.id;
            LoopBackAuth.save();

            $rootScope.currentUser = response.user;

            return $localForage.setItem('currentUser', response.user);
          } else {
            swal('Banned', 'You have been banned from this forum', 'error');
            return Member.logout();
          }
        });
    }

  }

})();
