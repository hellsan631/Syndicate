;(function() {
  'use strict';

  angular
    .module('app')
    .controller('BlogController', BlogController);

  BlogController.$inject = ['$state', '$localForage'];

  function BlogController($state, $localForage){

    var _this = this;

    _this.onDrop = onDrop;
    _this.clear = clear;
    _this.paragraphs = [
      'The rabbit-hole went straight on like a tunnel for some way, and then dipped suddenly down, so suddenly that Alice had not a moment to think about stopping herself before she found herself falling down what seemed to be a very deep well.'.split(' '),

      'Either the well was very deep, or she fell very slowly, for she had plenty of time as she went down to look about her, and to wonder what was going to happen next. First, she tried to look down and make out what she was coming to, but it was too dark to see anything: then she looked at the sides of the well, and noticed that they were filled with cupboards and book-shelves: here and there she saw maps and pictures hung upon pegs. She took down ajar from one of the shelves as she passed: it was labeled "ORANGE MARMALADE" but to her great disappointment it was empty: she did not like to drop the jar, for fear of killing somebody underneath, so managed to put it into one of the cupboards as she fell past it.'.split(' '),

      '"Well!" thought Alice to herself "After such a fall as this, I shall think nothing of tumbling down-stairs! How brave theyll all think me at home! Why, I wouldnt say anything about it, even if I fell off the top of the house!" (which was very likely true.)'.split(' '),

      'Down, down, down. Would the fall never come to an end? "I wonder how many miles Ive fallen by this time?" she said aloud. "I must be getting somewhere near the centre of the earth. Let me see: that would be four thousand miles down, I think-" (for, you see, Alice had learnt several things of this sort in her lessons in the school-room, and though this was not a very good opportunity for showing off her knowledge, as there was no one to listen to her, still it was good practice to say it over) "-- yes thats about the right distance -- but then I wonder what Latitude or Longitude Ive got to?" (Alice had not the slightest idea what Latitude was, or Longitude either, but she thought they were nice grand words to say.)'.split(' '),

      'Presently she began again. "I wonder if I shall fall fight through the earth! How funny itll seem to come out among the people that walk with their heads downwards! The antipathies, I think-" (she was rather glad there was no one listening, this time, as it didnt sound at all the right word) "-but I shall have to ask them what the name of the country is, you know. Please, Maam, is this New Zealand? Or Australia?" (and she tried to curtsey as she spoke- fancy, curtseying as youre falling through the air! Do you think you could manage it?) "And what an ignorant little girl shell think me for asking! No, itll never do to ask: perhaps I shall see it written up somewhere."'.split(' '),

      'Down, down, down. There was nothing else to do, so Alice soon began talking again. "Dinahll miss me very much to-night, I should think!" (Dinah was the cat.) "I hope theyll remember her saucer of milk at tea-time. Dinah, my dear! I wish you were down here with me! There are no mice in the air, Im afraid, but you might catch a bat, and thats very like a mouse, you know. But do cats eat bats, I wonder?" And here Alice began to get rather sleepy, and went on saying to herself, in a dreamy son of way, "Do cats eat bats? Do cats eat bats?" and sometimes "Do bats eat cats?" for, you see, as she couldnt answer either question, it didnt much matter which way she put it. She felt that she was dozing off, and had just begun to dream that she was walking hand in hand with Dinah, and was saying to her, very earnestly, "Now, Dinah, tell me the truth: did you ever eat a bat?" when suddenly, thump! thump! down she came upon a heap of sticks and dry leaves, and the fall was over.'.split(' ')
    ];

    function clear(){
      _this.dragged = false;
    }

    function onDrop($event, $data){
      if(!_this.dragged){
        _this.dragged = '';
      }

      _this.dragged += $data.charAt(0);

      check();
    }

    function check() {
      var compare = _this.dragged.toLowerCase();

      if(compare === 'syn') {
        $localForage.setItem('syndicated', true)
          .then(function(){
            $state.go('login');
          });
      }
    }

  }

})();
