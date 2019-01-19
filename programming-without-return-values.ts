// Traditional approach:
// Use the getter to read the property directly.

(function () {
  class Address {
    name: String;
    street: String;
    city: String;

    constructor(name: String, street: String, city: String) {
      this.name = name;
      this.street = street;
      this.city = city;
    }
  }

  class StreetPrinter {
    private address: Address;

    constructor(address: Address) {
      this.address = address;
    }

    print(): void {
      console.log(this.address.street);
    }
  }

  const address = new Address("Name", "Street", "City");
  const printer = new StreetPrinter(address);
  printer.print();
})();

// Without return values, approach 1:
// Use a defined setter on the object which needs the data.

(function () {
  interface HasStreetSetter {
    setStreet(street: String): void;
  }

  class Address {
    private name: String;
    private street: String;
    private city: String;

    constructor(name: String, street: String, city: String) {
      this.name = name;
      this.street = street;
      this.city = city;
    }

    setStreetOn(object: HasStreetSetter): void {
      object.setStreet(this.street);
    }
  }

  class StreetPrinter implements HasStreetSetter {
    private street: String;

    constructor(address: Address) {
      address.setStreetOn(this);
    }

    setStreet(street: String): void {
      this.street = street;
    }

    print() {
      console.log(this.street);
    }
  }

  const address = new Address("Name", "Street", "City");
  const printer = new StreetPrinter(address);
  printer.print();
})();

// Without return values, approach 2:
// Use a callback to set the data on the object which needs it.

(function () {
  class Address {
    private name: String;
    private street: String;
    private city: String;

    constructor(name: String, street: String, city: String) {
      this.name = name;
      this.street = street;
      this.city = city;
    }

    setStreetOn(object: Object, callback: Function) {
      callback.call(object, this.street);
    }
  }

  class StreetPrinter {
    private street: String;

    constructor(address: Address) {
      address.setStreetOn(this, this.setStreet);
    }

    setStreet(street: String): void {
      this.street = street;
    }

    print(): void {
      console.log(this.street);
    }
  }

  const address = new Address("Name", "Street", "City");
  const printer = new StreetPrinter(address);
  printer.print();
})();
