'use strict'

/*
 * The `new` operator
 * ==================
 */

function MyConstructor(passed) {
  this.myFixedProperty = 'fixed';
  this.myPassedProperty = passed;
}

/*
 * Using the `new` operator:
 */
const myInstanceWithNew = new MyConstructor('passed');

/*
 * Mimic same behavior without using the `new` operator:
 *
 *   1. Create a new empty object
 *   2. Set `__proto__` of the new object to the constructor's prototype
 *      If you don't do this, `instance.constructor` will not be set (it's
 *      `[Function: Object]` by default)
 *   3. Call the constructor with the new object as its `this` context
 */
const myInstanceWithoutNew = {}
myInstanceWithoutNew.__proto__ = MyConstructor.prototype;
MyConstructor.apply(myInstanceWithoutNew, ['passed']);

/*
 * The first two statements can be written as one using `Object.create`, and
 * instead of using `apply`, you can also use `call` which is the same as
 * `apply` but with the arguments spread instead of an array
 */
const myInstanceWithoutNew2 = Object.create(MyConstructor.prototype);
MyConstructor.call(myInstanceWithoutNew2, 'passed');

/*
 * Let's see if the instances are equal:
 */
console.log(myInstanceWithNew, myInstanceWithNew.constructor);
console.log(myInstanceWithoutNew, myInstanceWithoutNew.constructor);
console.log(myInstanceWithoutNew2, myInstanceWithoutNew2.constructor);
// They are all the same:
// => MyConstructor { myFixedProperty: 'fixed', myPassedProperty: 'passed' } [Function: MyConstructor]

/*
 * Let's examine the prototype of the constructor:
 */
console.log(typeof MyConstructor.prototype);
// => object
// It's an object
console.log(MyConstructor.prototype);
// => {}
// Apparently an empty object, but ...
console.log(MyConstructor.prototype.constructor);
// [Function: MyConstructor]
// => ... the `constructor` property is hidden and set to the function

/*
 * Let's bring it all together:
 */
console.log(myInstanceWithNew.__proto__.constructor === MyConstructor.prototype.constructor);
console.log(myInstanceWithNew.__proto__.constructor === MyConstructor);
console.log(MyConstructor.prototype.constructor === MyConstructor);
// => They are all the same!

/*
 * The `class` syntax
 * ==================
 */

/*
 * Using the `class` syntax added in ES6:
 */
class MyClass {
  constructor(passed) {
    this.myFixedProperty = 'fixed';
    this.myPassedProperty = passed;
  }

  variablesAsArray() {
    return [this.myFixedProperty, this.myPassedProperty];
  }
}
const myClassInstance = new MyClass('passed');
console.log(myClassInstance.variablesAsArray());
// => [ 'fixed', 'passed' ]

/*
 * Mimic same behavior without using the `class` syntax:
 *
 *  1. Create a constructor function (we already did this above)
 *  2. Add methods to the prototype of the constructor function
 */
// function MyConstructor(passed) {
//   this.myFixedProperty = 'fixed';
//   this.myPassedProperty = passed;
// }
MyConstructor.prototype.variablesAsArray = function() {
    return [this.myFixedProperty, this.myPassedProperty];
};
const myTheOldWayInstance = new MyConstructor('passed');
console.log(myTheOldWayInstance.variablesAsArray());
// => [ 'fixed', 'passed' ]

/*
 * Prototypical inheritance
 * ========================
 */

class MyChildClass extends MyClass {
  constructor(passed) {
    super(passed);
  }

  variablesReversedAsArray() {
    return [
      this.myFixedProperty.split('').reverse().join(''),
      this.myPassedProperty.split('').reverse().join('')
    ];
  }
}

const myChildClassInstance = new MyChildClass('passed');
console.log(myChildClassInstance.variablesAsArray());
console.log(myChildClassInstance.variablesReversedAsArray());
// => [ 'fixed', 'passed' ]
// => [ 'dexif', 'dessap' ]

/*
 * Mimic same behavior without using the `class` syntax:
 *
 * 1. Create a child constructor function which calls the parent constructor
 *    (be sure to use `apply` or `call` to pass the `this` context)
 * 2. Set the prototype of the child constructor to an object created with the
 *    parent constructor's prototype
 * 3. Define the child's methods on its prototype
 */
function MyChildConstructor(passed) {
  MyConstructor.apply(this, [passed]);
}
MyChildConstructor.prototype.__proto__ = MyConstructor.prototype;
// You can also do:
//     MyChildConstructor.prototype = Object.create(MyConstructor.prototype);
// You might even do:
//     MyChildConstructor.prototype = new MyConstructor();
// But this would call the parent constructor with no arguments, so be careful
MyChildConstructor.prototype.variablesReversedAsArray = function() {
  return [
    this.myFixedProperty.split('').reverse().join(''),
    this.myPassedProperty.split('').reverse().join('')
  ];
};

const myChildConstructorInstance = new MyChildConstructor('passed');
console.log(myChildConstructorInstance.variablesAsArray());
console.log(myChildConstructorInstance.variablesReversedAsArray());
// => [ 'fixed', 'passed' ]
// => [ 'dexif', 'dessap' ]

/*
 * Bringing it all together: It's not really inheritance, but delegation!
 * ======================================================================
 *
 * There are not real classes in JavaScript and therefore no real instances.
 *
 * We have:
 *   - functions and objects (basically key value stores)
 *   - objects can have functions as values -> this mimics methods of instances
 *   - functions can be used as constructors -> this mimics, well, constructors
 *   - functions have a prototype attached to them -> this enables them to
 *     "connect" objects when the function is used as a constructor
 *
 * So instantiation means creating a new empty object, "connecting" it to
 * another object which acts as its "parent" and the calling the constructor
 * "on it"
 *
 * Inheritance is achieved by chaining prototypes.

 * Objects delegate to other objects, passing their context (that thing which is
 * called `this`) with them.
 */

/*
 * How you use it:
 */
const myNotInstance = new MyChildConstructor('passed');
console.log(myNotInstance.variablesAsArray());
console.log(myNotInstance.variablesReversedAsArray());
// => [ 'fixed', 'passed' ]
// => [ 'dexif', 'dessap' ]

/*
 * What actually happens:
 *   - When calling the `variablesReversedAsArray` on the object, it
 *       - searches for the function in itself -> doesn't find it (objects build
 *         with `new` don't have their own functions unless you define these
 *         functions in the constructor -> I show you how to do this at the end)
 *       - searches in what is set as `__proto__` -> finds it
 *       - calls it with itself as the `this` context
 *   - When calls the `variablesAsArray` on the object, it
 *       - searches for the function in itself -> doesn't find it
 *       - searches in what is set as `__proto__` -> doesn't find it either
 *       - searches in what is set as `__proto__` of `__proto__` -> finds it
 *         (you see why it's called prototype chaining, right?)
 *       - calls it with itself as the `this` context
 */

console.log(myNotInstance.__proto__.variablesReversedAsArray.apply(myNotInstance));
console.log(myNotInstance.__proto__.__proto__.variablesAsArray.apply(myNotInstance));
// => [ 'dexif', 'dessap' ]
// => [ 'fixed', 'passed' ]

/*
 * And now all that without "instantiating" anything, pretending that
 * `theThisContext` is an object which resulted from a constructor call:
 */

const theThisContext = {
  myFixedProperty: 'fixed',
  myPassedProperty: 'passed',
  myFunctionOnTheObjectItself: function() {
    return 'I am defined on the object, not on the prototype';
  }
}
console.log(MyChildConstructor.prototype.variablesReversedAsArray.apply(theThisContext));
console.log(MyConstructor.prototype.variablesAsArray.apply(theThisContext));
console.log(theThisContext.myFunctionOnTheObjectItself());
// => [ 'dexif', 'dessap' ]
// => [ 'fixed', 'passed' ]
// => 'I am defined on the object, not on the prototype'

/*
 * Okay, you want to know how to do this "function on the object" thing with a
 * constructor? Here you go:
 */
function ConstructorWithFunctionOnObject(passed) {
  this.myFixedProperty = 'fixed';
  this.myPassedProperty = passed;
  this.myFunctionOnTheObjectItself = function() {
    return 'I am defined on the object, not on the prototype';
  }
}
const lastInstanceForToday = new ConstructorWithFunctionOnObject('passed');
console.log(lastInstanceForToday.myFunctionOnTheObjectItself());
// => 'I am defined on the object, not on the prototype'

/*
 * Is it a good idea? No, it's not. It's a waste of memory. If you have many
 * objects which where build with this constructor, you will have many copies of
 * the same function. If you define the function on the prototype, you only have
 * one copy.
 */
