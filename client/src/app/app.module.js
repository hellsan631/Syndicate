;(function() {
  'use strict';

  angular
    .module('app', [
      'ngAnimate',
      'ngTouch',
      'ui.router',
      'ui.materialize',
      'LocalForageModule',
      'angular-redactor',
      'permission',
      'lbServices',
      'ls.LiveSet',
      'ls.ChangeStream'
    ]);

})();
