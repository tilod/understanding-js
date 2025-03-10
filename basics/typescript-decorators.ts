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
function Logger(constructor: Function): void {
  constructor.prototype.log = function (logMessage: string): void {
    console.log(logMessage);
  }
}

/*
 * You can also pass arguments to the annotation. Define a function and return
 * the decorator as closure.
 */
function LoggerWithPrefix(prefix: string): ClassDecorator {
  return function (constructor: Function): void {
    constructor.prototype.logWithPrefix = function (logMessage: string): void {
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
  greet(): string {
    this.log(`Hello ${this.name}!`);
    this.logWithPrefix(`Hello ${this.name} again!`);

    return this.name
  }
}

new DecoratorDemo("World").greet();
// => Start: greet
// => Hello World!
// => MyClass: Hello World again!
// => End: greet, Returning: World
