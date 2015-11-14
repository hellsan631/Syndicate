;(function() {
  'use strict';

  angular
    .module('app')
    .config(Routes);

  Routes.$inject = ['$stateProvider', '$urlRouterProvider'];

  function Routes($stateProvider, $urlRouterProvider) {

    /////////////////////////////
    // Redirects and Otherwise //
    /////////////////////////////

    // Use $urlRouterProvider to configure any redirects (when) and invalid urls (otherwise).
    $urlRouterProvider
      .when('/t?id', '/topic/:id')
      .otherwise(function($injector) {
        var $state = $injector.get('$state');
        $state.go('blog');
      });

    $stateProvider
      .state({
        name: 'blog',
        url: '/blog',
        views: {
          main: {
            templateUrl: 'app/views/blog/blog.html',
            controller: 'BlogController',
            controllerAs: 'vm'
          }
        }
      })
      .state({
        name: 'login',
        url: '/login',
        views: {
          main: {
            templateUrl: 'app/views/login/login.html',
            controller: 'LoginController',
            controllerAs: 'vm'
          }
        }
      })
      .state({
        name: 'forum',
        url: '/forum',
        views: {
          main: {
            templateUrl: 'app/views/forum/forum.html',
            controller: 'ForumController',
            controllerAs: 'vm'
          }
        },
        data: {
          permissions: {
            only: ['member', 'admin'],
            redirectTo: 'login'
          }
        }
      });


  }

})();
