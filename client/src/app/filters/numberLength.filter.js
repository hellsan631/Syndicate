;(function() {
  'use strict';

  angular
    .module('app')
    .filter('numberLength', numberLength);

  function numberLength(){
    return function(a,b){
      return(1e4+a+'').slice(-b);
    };
  }
})();
