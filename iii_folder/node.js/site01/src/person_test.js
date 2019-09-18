const Person = require('./person');
const f = require('./func');

const p = new Person('one',22)

console.log(p.toJSON());
console.log(f(10));