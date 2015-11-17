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
        },
        data: {
          permissions: {
            only: ['guest'],
            redirectTo: 'forum'
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
        },
        data: {
          permissions: {
            except: ['member', 'admin'],
            redirectTo: 'forum'
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
      })
      .state({
        name: 'topic',
        url: '/topic/:id',
        views: {
          main: {
            templateUrl: 'app/views/forum/topic.html',
            controller: 'TopicController',
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
