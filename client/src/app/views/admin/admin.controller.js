;(function() {
  'use strict';

  angular
    .module('app')
    .controller('AdminController', AdminController);

  AdminController.$inject = [
    '$rootScope', '$localForage', 'Member', 'RandomWords'
  ];

  function AdminController($rootScope, $localForage, Member, RandomWords){
    var _this = this;

    _this.user = {
      password: RandomWords.password()
    };

    _this.password = function() {
      _this.user.password = RandomWords.password();
    };
  }

})();
