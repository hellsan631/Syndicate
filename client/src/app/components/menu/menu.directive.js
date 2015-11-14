;(function() {
  'use strict';

  angular
    .module('app')
    .directive('topMenu', TopMenu);

  TopMenu.$inject = ['$rootScope', '$state', '$localForage', 'LoopBackAuth', 'Member'];

  function TopMenu($rootScope, $state, $localForage, LoopBackAuth, Member) {
    var directive = {
      restrict: 'E',
      transclude: true,
      templateUrl: 'app/components/menu/menu.html',
      scope: {
        user: '='
      },
      controller: controller
    };

    return directive;

    function controller($scope) {
      
      $scope.openLoginModal = openLoginModal;
      $scope.submitLogin    = submitLogin;

      function openLoginModal() {
        $('.button-collapse').sideNav('hide');

        $('#LoginModal').openModal();
      }

      function submitLogin() {
        loginUser($scope.login)
          .then(function(){
            $('#LoginModal').closeModal();
          });
      }

      function loginUser(loginFields){
        return Member.login(loginFields).$promise
          .then(function(response){
            LoopBackAuth.currentUserId = response.userId;
            LoopBackAuth.accessTokenId = response.id;
            LoopBackAuth.save();

            $localForage.setItem('currentUser', response.user);
            $rootScope.currentUser = response.user;
          });
      }

    }

  }

})();
