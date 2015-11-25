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
    var _memberModal = $('#EditMember');

    _this.user = {
      password: RandomWords.password()
    };
    _this.members = [];

    _this.password = password;
    _this.submitNewUser = submitNewUser;
    _this.getMembers = getMembers;
    _this.deleteMember = deleteMember;
    _this.openEditModal = openEditModal;
    _this.editPassword = editPassword;
    _this.clearNewUser = clearNewUser;
    _this.saveUser = saveUser;

    getMembers();

    function saveUser() {
      swal({
        title: 'Are you sure?',
        text: 'Changes you make might prevent a user from logging in!',
        type: 'info',
        showCancelButton: true,
        confirmButtonText: 'Save',
        cancelButtonText: 'Cancel',
        closeOnConfirm: true,
        closeOnCancel: true
      }, confirmSave);
    }

    function confirmSave(confirm) {
      if (confirm) {
        var editMember = {};

        editMember.email = _this.editMember.email;
        editMember.username = _this.editMember.username;

        if (_this.editMember.password && _this.editMember.password.length > 6) {
          editMember.password = _this.editMember.password;
        }

        if (_this.editMember.isAdmin) {
          editMember.isAdmin = 1;
        } else {
          editMember.isAdmin = 0;
        }

        Member.prototype$updateAttributes({id: _this.editMember.id}, editMember)
          .$promise
          .then(function(topic){
            swal('Saved', 'Successfully saved member', 'success');
            _memberModal.closeModal();
          })
          .catch(function(err){
            swal('Error', 'Unable to save member', 'error');
            console.log(err);
          });
      }
    }

    function clearNewUser() {
      _this.user = {
        email: '',
        username: ''
      };
      password();
    }

    function openEditModal(member) {
      var editMember = member;
      editMember.isAdmin = member.isAdmin === 1 || member.isAdmin === true ? true : false;
      editMember.password = '';

      _this.editMember = editMember;

      _memberModal.openModal();
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

    function editPassword() {
      _this.editMember.password = RandomWords.password();
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
