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
  const passedValue = value;
  const nonPassedValue = 2;

  const printValue = () => {
    console.log(passedValue * nonPassedValue);
  };

  return { printValue };
}

new MyClass(3).printValue();
MyClosure(3).printValue();
