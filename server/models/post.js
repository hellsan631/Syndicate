var bPromise = require('bluebird');

module.exports = function(Post) {
  Post.observe('before save', function addTags(ctx, next) {

  var Topic = Post.app.models.Topic;

  var instance = false;

  if(ctx.instance)
    instance = 'instance';
  else if(ctx.currentInstance)
    instance = 'currentInstance';
  else
    instance = 'data';

  if (instance) {

    updateTopicLastTime(ctx[instance].topicId)
      .then(function(){
        next();
      })
      .catch(function(err){
        next(err);
      });

  } else {
    next();
  }

  function updateTopicLastTime(topicId) {
    return Topic.findById(topicId)
      .then(function(topic){
        if (topic) {
          return topic.updateAttribute('lastUpdated', new Date());
        }
      });
  }

  });
};
