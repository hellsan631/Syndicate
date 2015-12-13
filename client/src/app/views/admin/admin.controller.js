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

    _this.password      = password;
    _this.submitNewUser = submitNewUser;
    _this.getMembers    = getMembers;
    _this.banMember     = banMember;
    _this.openEditModal = openEditModal;
    _this.editPassword  = editPassword;
    _this.clearNewUser  = clearNewUser;
    _this.saveUser      = saveUser;
    _this.unbanMember   = unbanMember;

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

        editMember.email    = _this.editMember.email;
        editMember.isAdmin  = _this.editMember.isAdmin;

        if (_this.editMember.password && _this.editMember.password.length > 6) {
          editMember.password = _this.editMember.password;
        }

        Member.prototype$updateAttributes({id: _this.editMember.id}, editMember)
          .$promise
          .then(function(topic){
            swal('Saved', 'Successfully saved member', 'success');
            getMembers();
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
      editMember.password = '';

      _this.editMember = editMember;

      _memberModal.openModal();
    }

    function unbanMember(memberId, $event){
      $event.stopPropagation();

      swal({
        title: 'Are you sure?',
        type: 'info',
        showCancelButton: true,
        confirmButtonText: 'Un-Ban',
        cancelButtonText: 'Cancel',
        closeOnConfirm: true,
        closeOnCancel: true
      }, function(confirm){
        if(confirm) {
          confirmUnBan(memberId);
        }
      });
    }

    function confirmUnBan(memberId) {
      Member.prototype$updateAttributes({id: memberId}, {banned: false})
        .$promise
        .then(function(topic){
          swal('Banned Lifted', 'Successfully unbanned member', 'success');
          getMembers();
          _memberModal.closeModal();
        })
        .catch(function(err){
          swal('Error', 'Unable to un-ban member', 'error');
          console.log(err);
        });

    }

    function banMember(memberId, $event) {
      $event.stopPropagation();

      swal({
        title: 'Are you sure?',
        text: 'This will not remove a users posts/topics. It will only prevent them from logging in.',
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Ban',
        confirmButtonColor: '#ff3B33',
        cancelButtonText: 'Cancel',
        closeOnConfirm: true,
        closeOnCancel: true
      }, function(confirm){
        if(confirm){
          confirmBan(memberId);
        }
      });
    }

    function confirmBan(memberId) {
      Member.prototype$updateAttributes({id: memberId}, {banned: true})
        .$promise
        .then(function(topic){
          swal('Banned', 'Successfully banned member', 'success');
          getMembers();
          _memberModal.closeModal();
        })
        .catch(function(err){
          swal('Error', 'Unable to ban member', 'error');
          console.log(err);
        });
    }

    function getMembers() {
      Member.find().$promise
        .then(function(res){
          _this.members = res;
        });
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

        swal('Success!', 'Successfully created '+res.id, 'success');

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

        if (!user.email) {
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
