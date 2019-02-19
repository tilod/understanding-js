class MyClass {
  constructor(value) {
    this.passedValue = value;
    this.nonPassedValue = 2;
  }

  printValue() {
    console.log(this.passedValue * this.nonPassedValue);
  }
}

function MyClosure(value) {
  let passedValue = value;
  let nonPassedValue = 2;

  let printValue = () => {
    console.log(passedValue * nonPassedValue);
  };

  return { printValue };
}

new MyClass(3).printValue();
MyClosure(3).printValue();
