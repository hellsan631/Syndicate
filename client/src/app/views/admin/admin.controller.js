;(function() {
  'use strict';

  angular
    .module('app')
    .controller('AdminController', AdminController);

  AdminController.$inject = [
    '$scope', '$rootScope', '$timeout', '$q',
    '$localForage',
    'LoopBackAuth', 'createChangeStream', 'Member', 'RandomWords'
  ];

  function AdminController($scope, $rootScope, $timeout, $q, $localForage,
    LoopBackAuth, createChangeStream, Member, RandomWords){

    var _this = this;

    _this.user = {
      password: RandomWords.password()
    };
    _this.members = [];

    _this.password = password;
    _this.submitNewUser = submitNewUser;
    _this.getMembers = getMembers;
    _this.deleteMember = deleteMember;
    _this.openEditModal = openEditModal;

    getMembers();

    function openEditModal(){
      console.log('asd');
    }

    function deleteMember(memberId, event) {
      event.stopPropagation();
      console.log('ejllp');
    }

    function getMembers() {
      Member.find().$promise
        .then(filterNewResults);
    }

    function filterNewResults(results) {
      results.forEach(function(result){
        var dupe = false;

        if (_this.members.length > 0){
          _this.members.forEach(function(member){
            if (result.id === member.id) {
              dupe = true;
            }
          });
        }

        if (!dupe) {
          _this.members.push(result);
        }

      });

      if(!_this.initialized) {
        $timeout(function(){
          _this.initialized = true;
        }, 100);
      }

    }

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
