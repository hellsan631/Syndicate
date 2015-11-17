;(function() {
  'use strict';

  angular
    .module('app')
    .directive('topMenu', TopMenu);

  TopMenu.$inject = ['$rootScope', '$state', '$localForage', 'Member', 'LoopBackAuth'];

  function TopMenu($rootScope, $state, $localForage, Member, LoopBackAuth) {
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

      $scope.logout = logout;

      function logout() {
        Member.logout().$promise
          .then(function(){
            return $localForage.removeItem('currentUser');
          })
          .then(function(){
            LoopBackAuth.clearUser();
            LoopBackAuth.clearStorage();
            $rootScope.currentUser = false;
            $state.go('login');
          });
      }

    }

  }

})();
