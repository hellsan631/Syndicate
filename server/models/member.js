module.exports = function(Member) {

  Member.validatesUniquenessOf('username');

};
