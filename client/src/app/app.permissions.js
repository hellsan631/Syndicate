;(function() {
  'use strict';

  angular
    .module('app')
    .run(DefinePermissions);

  DefinePermissions.$inject = [
    '$q', '$localForage', 'Permission'
  ];

  function DefinePermissions($q, $localForage, Permission){
    // Define anonymous role
    Permission
      .defineRole('guest', function () {
        var deferred = $q.defer();

        $localForage.getItem('currentUser')
          .then(function(res){

            if (res) {
              deferred.reject();
            } else {
              deferred.resolve();
            }

          });

        return deferred.promise;
      })
      .defineRole('member', function () {
        var deferred = $q.defer();

        $localForage.getItem('currentUser')
          .then(function(res){

            if (res) {
              deferred.resolve();
            } else {
              deferred.reject();
            }

          });

        return deferred.promise;
      })
      .defineRole('admin', function () {
        var deferred = $q.defer();

        $localForage.getItem('currentUser')
          .then(function(res){

            if (res && parseInt(res.isAdmin) === 1) {
              deferred.resolve();
            } else {
              deferred.reject();
            }
            
          });

        return deferred.promise;
      });
  }

})();
