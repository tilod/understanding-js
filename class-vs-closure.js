'use strict'

/*
 * Classes and closures are the same!
 * ==================================
 *
 * ... so you can mimic object-oriented programming in functional languages.
 */

/*
 + Member variables for classes are used to store state during the lifetime of
 * an instance of the class.
 *
 *   - The constructor sets the initial state of the instance. The state is
 *     stored as long as the instance exists.
 *   - Methods access the state of the instance.
 */
class MyClass {
  constructor(value) {
    this.passedValue = value;
    this.fixedValue = 2;
  }

  add() {
    return this.passedValue + this.fixedValue;
  }

  multiply() {
    return this.passedValue * this.fixedValue;
  }
}

/*
 * Closures are functions that have access to the outer scope in which they were
 * created, even after that scope has closed. This allows them to store state
 * between calls.
 *
 *   - The outer scope is the function in which the closures are created. It
 *     acts as a constructor and sets the initial state of the closures. The
 *     state is stored as local variables in the outer scope, but they exist as
 *     long as the _closures_ (not the outer scope) exist.
 *   - The outer scope returns an object with two functions defined inside it.
 *     These functions are the closures.
 */
function MyClosureScope(value) {
  const passedValue = value;
  const fixedValue = 2;

  const add = function() {
    return passedValue + fixedValue;
  }

  const multiply = function() {
    return passedValue * fixedValue;
  };

  return { add, multiply };
}

/*
 * You can use both the same way
 */
const myClassInstance = new MyClass(3);
const myClosureInstance = MyClosureScope(3);
console.log(myClassInstance.add());
console.log(myClassInstance.multiply());
console.log(myClosureInstance.add());
console.log(myClosureInstance.multiply());
// => 5
// => 6
// => 5
// => 6
