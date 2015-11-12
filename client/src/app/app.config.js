;(function() {
  'use strict';

  angular
    .module('app')
    .config(AppConfig);

  AppConfig.$inject = ['$stateProvider', '$urlRouterProvider'];

  function AppConfig($stateProvider, $urlRouterProvider) {

    $stateProvider
      .state({
        name: 'main',
        url: '/main',
        title: 'Praxus Front Page',
        views: {
          main: {
            templateUrl: 'app/views/main/main.html',
            controller: 'MainController',
            controllerAs: 'vm'
          }
        }
      });

    $urlRouterProvider.otherwise(function($injector) {
      var $state = $injector.get('$state');
      $state.go('main');
    });

  }

})();
