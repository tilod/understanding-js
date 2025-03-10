/*
 * Typescript Decorators
 * =====================
 *
 * ... are basically just functions which modify the prototype of the "class"
 * or the method they are applied on.
 */

/*
 * Define a class decorator as a function which takes a function as argument.
 * The function is the constructor function defined by the `class` keyword.
 */
function Logger(constructor: Function) {
  constructor.prototype.log = function (logMessage: string) {
    console.log(logMessage);
  }
}

/*
 * You can also pass arguments to the annotation. Define a function and return
 * the decorator as closure.
 */
function LoggerWithPrefix(prefix: string) {
  return function (constructor: Function) {
    constructor.prototype.logWithPrefix = function (logMessage: string) {
      console.log(`${prefix}: ${logMessage}`);
    }
  }
}

/*
 * Define a method decorator as a function which takes a function (the method to
 * decorate) and a context as arguments.
 *
 * This example uses the updated Decorator API, introduced in TypeScript 5.
 */
function TraceExecution(method: Function, context: ClassMethodDecoratorContext) {
  const methodName = String(context.name);

  return function (...args: any[]) {
    console.log(`Start: ${methodName}`);
    // The TypeScript compiler shows a warning because `this` is untyped and
    // implicitly declared as `any`. This is fine for us so we silence the
    // warning with @ts-ignore.
    // @ts-ignore
    const result = method.apply(this, args);
    console.log(`End: ${methodName}, Returning: ${result}`);
    return result;
  };
}

/*
 * Use the decorators:
 */
@Logger
@LoggerWithPrefix('MyClass')
class DecoratorDemo {
  private readonly name: string;

  constructor(name: string) {
    this.name = name;
  }

  @TraceExecution
  greet() {
    // The TypeScript compiler shows warnings because it can't find the
    // declaration of the dynamically added methods. We use @ts-ignore to
    // silence them.
    // @ts-ignore
    this.log(`Hello ${this.name}!`);
    // @ts-ignore
    this.logWithPrefix(`Hello ${this.name} again!`);

    return this.name
  }
}

new DecoratorDemo("World").greet();
// => Start: greet
// => Hello World!
// => MyClass: Hello World again!
// => End: greet, Returning: World
