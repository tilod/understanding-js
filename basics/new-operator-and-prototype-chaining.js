'use strict'

/*
 * Object-oriented vs. prototype-based
 * ===================================
 *
 * JavaScript is what's called a "classless object-oriented", or a
 * "prototype-based" language. This means that there are no classes and
 * instances of classes, just objects. These objects can be used as prototypes
 * for other objects. More of that later.
 *
 * There are also no methods (i.e. functions which are declared on a class),
 * just functions. However, these functions can be assigned to variables and
 * passed around like any other value. They can also be attached to objects.
 * When you call a function on an object, it _looks like_ you are calling a
 * method on an instance of a class, but you are actually just calling a
 * function with the object as the `this` context.
 */

const greet = function(greeting) {
  console.log(greeting + ' ' + this.name);
}
const greeter = {
  name: 'World',
  say: greet
}
greeter.say('Hello');
// => Hello World

/*
 * The `this` context is set when the function is called. It's not set when the
 * function is defined. This means that you can call the function on different
 * objects and the `this` context will be different.
 */
const guysGreeter = {
  name: 'Guys',
  say: greet
}
guysGreeter.say('Hello');
// => Hello Guys

/*
 * There are two other ways to call a function with a specific `this` context:
 *
 *   - `call` which takes the context as the first argument and the arguments
 *     for the function as the following arguments
 *   - `apply` which also takes the context as the first argument but the
 *     arguments for the function as an array
 *
 * Mind that the context can be any object. As long as it has the correct
 * properties (`name` in our example), it can be used as the context.
 */
greet.call({name: 'Alice'}, 'Hello');
// => Hello Alice
greet.apply({name: 'Bob'}, ['Hello']);
// => Hello Bob

/*
 * Also worth mentioning is the `bind` function which returns a new function
 * with the context bound to the object you pass to it. You will see this in
 * many libraries and frameworks.
 */
const boundGreetFunction = greet.bind({name: 'Charlie'});
boundGreetFunction('Hello');
// => Hello Charlie

/*
 * This disables the dynamic binding of `this` to the object on which the
 * function is called.
 */
const otherContext = {
  name: 'David',
  sayBound: boundGreetFunction
};
console.log(otherContext.sayBound('Hello still'));
// => Hello still Charlie

/*
 * Constructor functions and the `new` operator
 * ============================================
 *
 * Constructor functions are used to create objects. Usually they are used to
 * set the initial state of objects like constructors in "proper"
 * object-oriented languages. They are named with a capital letter by
 * convention. Otherwise, they are just functions like any other.
 *
 * The `new` operator is used to create an object from a constructor function.
 */
function MyConstructor(passedArgument) {
  this.myFixedProperty = 'fixed';
  this.myPassedProperty = passedArgument;
}
const myInstanceWithNew = new MyConstructor('passed');
console.log(myInstanceWithNew);
// => MyConstructor { myFixedProperty: 'fixed', myPassedProperty: 'passed' }

/*
 * To understand what happens under the hood, we mimic the same behavior
 * without using the `new` operator:
 *
 *   1. Create a new empty object.
 *   2. Set `__proto__` of the new object to the constructor's prototype.
 *   3. Call the constructor with the new object as its `this` context.
 */
const myInstanceWithoutNew = {}
myInstanceWithoutNew.__proto__ = MyConstructor.prototype;
MyConstructor.apply(myInstanceWithoutNew, ['passed']);
console.log(myInstanceWithoutNew);
// => MyConstructor { myFixedProperty: 'fixed', myPassedProperty: 'passed' }

/*
 * `__proto__` is a hidden property which is defined for all objects. It's
 * a blank object for objects which are created with the object literal syntax.
 */
const emptyObject = {};
console.log(emptyObject.__proto__);
// => {}

/*
 * Likewise `prototype` is a hidden property which is defined for all functions.
 * It's a blank object for functions which are created with the function
 * literal syntax.
 */
const newFunction = function() { return 'whatever' };
console.log(newFunction.prototype);
// => {}

/*
 * What you will also see a lot is `Object.create`. It's just a shorthand for:
 *
 *     const myInstanceWithoutNew = {}
 *     myInstanceWithoutNew.__proto__ = MyConstructor.prototype;
 *
 * And just for fun, we use `call` here instead of `apply`:
 */
const myInstanceWithoutNew2 = Object.create(MyConstructor.prototype);
MyConstructor.call(myInstanceWithoutNew2, 'passed');
console.log(myInstanceWithoutNew2);
// => MyConstructor { myFixedProperty: 'fixed', myPassedProperty: 'passed' }

/*
 * Now let's examine the prototype of the constructor function further:
 */
console.log(typeof MyConstructor.prototype);
// => object
// It's an object (we know that already)
console.log(MyConstructor.prototype);
// => {}
// Apparently an empty object (we know that already too), but ...
console.log(MyConstructor.prototype.constructor);
// => [Function: MyConstructor]
// ... it has a hidden `constructor` property which is set to the constructor
// function
console.log(MyConstructor.prototype.constructor === MyConstructor);
// => true

/*
 * This `constructor` is also set on the created object. If you don't use `new`,
 * it will happen when you set the `__proto__` manually.
 */
console.log(myInstanceWithNew.constructor === MyConstructor);
console.log(myInstanceWithoutNew.constructor === MyConstructor);
// => true
// => true

/*
 * Functions on objects
 * ====================
 *
 * ... should be defined on the prototype of the object (which effectively means
 * they are defined on the constructor function's prototype):
 */
MyConstructor.prototype.getVariablesAsArray = function() {
  return [this.myFixedProperty, this.myPassedProperty];
};
const myNewInstance = new MyConstructor('passed');
console.log(myNewInstance.getVariablesAsArray());
// => [ 'fixed', 'passed' ]

/*
 * Mind that the function is actually defined on the prototype, _not_ on the
 * object itself. This means that the function is shared between all objects
 * created by the constructor. This saves memory.
 */
console.log(myNewInstance);
console.log(myNewInstance.__proto__);
// => MyConstructor { myFixedProperty: 'fixed', myPassedProperty: 'passed' }
// => { variablesAsArray: [Function (anonymous)] }

/*
 * Reminder 1: This is different from the object we created at the beginning
 * where the function was defined on the object itself.
 */
console.log(greeter);
// => { name: 'World', greet: [Function: greet] }

/*
 * Reminder 2: But `this` is still the object (and not it's prototype) in both
 * cases when calling the function. `this` is _dynamically_ bound to the object
 * on which the function is called.
 */

/*
 * The `class` syntax introduced in ES6
 *
 * ... is just syntactic sugar for what we just saw.
 */
class MyClass {
  constructor(passed) {
    this.myFixedProperty = 'fixed';
    this.myPassedProperty = passed;
  }

  getVariablesAsArray() {
    return [this.myFixedProperty, this.myPassedProperty];
  }
}
const myClassInstance = new MyClass('passed');
console.log(myClassInstance.getVariablesAsArray());
console.log(myClassInstance);
console.log(myClassInstance.constructor);
console.log(myClassInstance.__proto__);
// => [ 'fixed', 'passed' ]
// => MyClass { myFixedProperty: 'fixed', myPassedProperty: 'passed' }
// => [class: MyClass]

/*
 * Prototypical inheritance
 * ========================
 *
 *   1. Create a child constructor function which calls the parent constructor
 *      (be sure to use `apply` or `call` to pass the `this` context)
 *   2. Set the prototype of the child constructor to an object created with the
 *      parent constructor's prototype.
 *   3. Define the child's methods on its prototype
 */
function MyChildConstructor(passed) {
  MyConstructor.apply(this, [passed]);
}
MyChildConstructor.prototype.__proto__ = Object.create(MyConstructor.prototype);
MyChildConstructor.prototype.getVariablesReversedAsArray = function() {
  return [
    this.myFixedProperty.split('').reverse().join(''),
    this.myPassedProperty.split('').reverse().join('')
  ];
};

const myChildConstructorInstance = new MyChildConstructor('passed');
console.log(myChildConstructorInstance.getVariablesAsArray());
console.log(myChildConstructorInstance.getVariablesReversedAsArray());
// => [ 'fixed', 'passed' ]
// => [ 'dexif', 'dessap' ]

/*
 * Instead of creating a new object with `Object.create` and setting it as the
 * prototype, you could also do:
 *
 *     MyChildConstructor.prototype = MyConstructor.prototype;
 *
 * But this would mean that changes to the child's prototype would also affect
 * the parent's prototype. This is usually not what you want.
 *
 * You might even do:
 *
 *     MyChildConstructor.prototype = new MyConstructor();
 *
 * But this would call the parent constructor (with no arguments in this
 * example), so be careful.
 */

/*
 * And now with the new `class` syntax
 */
class MyChildClass extends MyClass {
  constructor(passed) {
    super(passed);
  }

  getVariablesReversedAsArray() {
    return [
      this.myFixedProperty.split('').reverse().join(''),
      this.myPassedProperty.split('').reverse().join('')
    ];
  }
}

const myChildClassInstance = new MyChildClass('passed');
console.log(myChildClassInstance.getVariablesAsArray());
console.log(myChildClassInstance.getVariablesReversedAsArray());
// => [ 'fixed', 'passed' ]
// => [ 'dexif', 'dessap' ]

/*
 * The last bit: Function lookup
 * ==============================
 *
 * When you call a function on an object, JavaScript first looks for the
 * function on the object itself. If it doesn't find it, it looks on the
 * prototype of the object. If it doesn't find it there, it looks on the
 * prototype of the prototype, and so on.
 *
 * So when you do this (which looks a lot like object-orientation) ...
 */
const lastOne = new MyChildConstructor('passed');
console.log(lastOne.getVariablesAsArray());
console.log(lastOne.getVariablesReversedAsArray());
// => [ 'fixed', 'passed' ]
// => [ 'dexif', 'dessap' ]

/*
 * ... this is what actually happens:
 */
console.log(lastOne.__proto__.getVariablesReversedAsArray.apply(lastOne));
console.log(lastOne.__proto__.__proto__.getVariablesAsArray.apply(lastOne));
// => [ 'dexif', 'dessap' ]
// => [ 'fixed', 'passed' ]
// See why it's called "prototype chaining"?

/*
 * We can even break this up further and do it without "instantiating"
 * anything, pretending that `theContext` is an object which resulted from a
 * constructor call:
 */
const theContext = {
  myFixedProperty: 'fixed',
  myPassedProperty: 'passed',
}
console.log(MyChildConstructor.prototype.getVariablesReversedAsArray.apply(theContext));
console.log(MyConstructor.prototype.getVariablesAsArray.apply(theContext));
// => [ 'dexif', 'dessap' ]
// => [ 'fixed', 'passed' ]

/*
 * Bringing it all together: It's not really inheritance, but delegation!
 * ======================================================================
 *
 * There are no real classes in JavaScript. "Instantiation" means creating a new
 * object, "connecting" it to another object which acts as its "parent" and the
 * calling the constructor "on it".
 *
 * Inheritance is achieved by chaining prototypes. Objects delegate to their
 * parent object, passing their context (that thing which is called `this`) with
 * them.
 */
