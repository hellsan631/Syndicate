;(function() {
  'use strict';

  angular
    .module('app')
    .controller('AdminController', AdminController);

  AdminController.$inject = [
    '$rootScope', '$q', '$localForage', 'Member', 'RandomWords'
  ];

  function AdminController($rootScope, $q, $localForage, Member, RandomWords){
    var _this = this;

    _this.user = {
      password: RandomWords.password()
    };

    _this.password = password;
    _this.submitNewUser = submitNewUser;

    function password() {
      _this.user.password = RandomWords.password();
    }

    function submitNewUser() {
      verifyUser(_this.user)
        .then(createUser)
        .then(clearForm)
        .catch(errorMessage);
    }

    function clearForm(res) {
      var deferred = $q.defer();

      setTimeout(function() {

        swal('Success!', 'Successfully created '+res.username, 'success');

        deferred.resolve(res);

      });

      return deferred.promise;
    }

    function createUser(user) {
      return Member.create(user).$promise;
    }

    function verifyUser(user) {
      var deferred = $q.defer();

      setTimeout(function() {

        if (!user.username) {
          deferred.reject('New users require a username');
        } else if (!user.email) {
          deferred.reject('Users require an email');
        } else {
          deferred.resolve(user);
        }

      });

      return deferred.promise;
    }

    function errorMessage(title, text) {
      swal(title, text, 'error');

      return $q(function(){return null;});
    }

  }

})();
