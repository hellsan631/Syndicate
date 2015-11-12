module.exports = function(Person) {

  Person.validatesUniquenessOf('fullname');

};
