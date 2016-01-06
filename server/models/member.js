module.exports = function(Member) {

  Member.validatesUniquenessOf('username');

  Member.observe('before save', function createUniqueUsername(ctx, next) {

    var instance = false;

    if(ctx.instance)
      instance = 'instance';
    else
      instance = 'data';

    if (instance && ctx.isNewInstance) {

      findUsername()
        .then(function(){
          next();
        })
        .catch(function(err){
          next(err);
        });

    } else {
      next();
    }

    function findUsername(topicId) {
      var findFilter = {
        orderBy: 'username DESC'
      };

      return Member.find(findFilter)
        .then(function(member){
          if (member) {
            if (member.username) {
              ctx[instance].username = member.username + 1;
            } else {
              ctx[instance].username = 1;
            }
          }
        });
    }

  });

};
