'use strict'

/*
 * Classes and closures are the same!
 * ==================================
 */

/*
 + Member variables for classes are used to store state during the lifetime of
 * an instance of the class.
 */
class MyClass {
  constructor(value) {
    this.passedValue = value;
    this.fixedValue = 2;
  }

  printValue() {
    console.log(this.passedValue * this.fixedValue);
  }
}

/*
 * Closures are functions which
 */
function MyClosure(value) {
  const passedValue = value;
  const fixedValue = 2;

  const printValue = () => {
    console.log(passedValue * fixedValue);
  };

  return { printValue };
}

/*
 * You can use both the same way
 */
const myClassInstance = new MyClass(3);
const myClosureInstance = MyClosure(3);
myClassInstance.printValue();
myClosureInstance.printValue();
// => 6
// => 6
