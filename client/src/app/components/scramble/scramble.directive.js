;(function() {
  'use strict';

  angular
    .module('app')
    .directive('scramble', Scramble);

  Scramble.$inject = ['$q', '$timeout'];

  function Scramble($q, $timeout) {
    var directive = {
      restrict: 'A',
      scope: {
        scramble: '=ngModel'
      },
      require: 'ngModel',
      controller: controller,
    };

    return directive;

    function controller($scope) {
      var animating = false;
      var step = 3;
      var fps = 10;
      var value = '';
      var difference = 0;
      var options;
      var safe;

      $scope.$watch('scramble', scramble);

      function scramble(newValue, oldValue) {
        if (!animating && newValue) {

          value = newValue;

          if(!oldValue) {
            oldValue = '';
          }

          animating = newValue;

          difference = newValue.length - oldValue.length;
          options = getStringData(newValue);

          options.step = 8;

          if (difference > 0) {
            deferredShuffle(oldValue.length - 1)
              .then(function(){
                //$scope.scramble = value;
                $timeout(function(){
                  animating = false;
                });
              });
          } else {
            animating = false;
          }

        }
      }

      function deferredShuffle(start){
        var deferred = $q.defer();

        options.callback = function() {
          deferred.resolve();
        };

        shuffle(start);

        return deferred.promise;
      }

      function shuffle(start) {
        // This code is run options.fps times per second
        // and updates the contents of the page element


        var len     = options.letters.length;
        var strCopy = '' + value.slice(0); // Fresh copy of the string
        var i;

        if (start > len) {

          // The animation is complete. Updating the
          // flag and triggering the callback;
          options.callback();
          return;
        }

        //console.log('run');

        // All the work gets done here

        for (i = Math.max(start, 0); i < len; i++){

          if ( i < start + options.step) {

            // Generate a random character at this position
            strCopy = replaceAt(strCopy, options.letters[i], randomChar(options.types[options.letters[i]]));
          } else {
            strCopy = replaceAt(strCopy, options.letters[i], '');
          }

          // The start argument and options.step limit
          // the characters we will be working on at once
        }

        $timeout(function(){
          $scope.scramble = strCopy;
        });

        $timeout(function(){
          --options.step;
          shuffle(start + 1);
        }, 1000 / fps);
      }

      function randomChar(type){
        var pool = '';

        if (type === 'lowerLetter') {
          pool = 'abcdefghijklmnopqrstuvwxyz0123456789';
        } else if (type === 'upperLetter') {
          pool = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        } else if (type === 'symbol') {
          pool = ',.?/\\(^)![]{}*&^%$#\'"';
        }

        var arr = pool.split('');
        return arr[Math.floor(Math.random()*arr.length)];
      }

      function replaceAt(string, index, character) {
        return string.substr(0, index) + character + string.substr(index+character.length);
      }

      function getStringData(str) {
        // The types array holds the type for each character;
        // Letters holds the positions of non-space characters;

        var types = [];
        var letters = [];
        var skip = false;

        // Looping through all the chars of the string

        for(var i = 0; i < str.length; i++){

          var ch = str[i];

          if (ch === '<') {
            skip = true;
          }

          if (ch === '>') {
            skip = false;
            continue;
          }

          if (skip === true) {
            continue;
          }

          if (ch === ' ') {
            types[i] = 'space';
            continue;
          } else if(/[a-z]/.test(ch)){
            types[i] = 'lowerLetter';
          } else if(/[A-Z]/.test(ch)){
            types[i] = 'upperLetter';
          } else {
            types[i] = 'symbol';
          }

          letters.push(i);
        }

        return {
          types: types,
          letters: letters,
          skip: skip
        };
      }

    }

  }

})();
