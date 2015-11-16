;(function() {
  'use strict';

  angular
    .module('app')
    .filter('trust', trust);

  trust.$inject = ['$sce'];

  function trust($sce){
    return function(text) {
      return $sce.trustAsHtml(text);
    };
  }
})();
