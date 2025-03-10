/*
 * Programming without return values
 * =================================
 *
 * HINT: In this example we assume that JavaScript is a proper object-oriented
 * language and use the respective terminology.
 *
 * Imagine a world without getters. Every method returns the instance it belongs
 * to, nothing else. This makes method chaining very easy, but how
 * can we fetch values from other instances?
 */

/*
 * The traditional approach we used to know
 *
 * We have getters and read the values directly.
 */
class AddressTraditional {
  readonly name: string;
  readonly street: string;
  readonly city: string;

  constructor(name: string, street: string, city: string) {
    this.name = name;
    this.street = street;
    this.city = city;
  }
}

class StreetPrinterTraditional {
  private readonly address: AddressTraditional;

  constructor(address: AddressTraditional) {
    this.address = address;
  }

  print() {
    console.log(
      this.address.name + '\n' +
      this.address.street + '\n' +
      this.address.city
    );
  }
}

const addressTraditional =
  new AddressTraditional("Sherlock Holmes", "221B Baker Street", "London");
const printerTraditional = new StreetPrinterTraditional(addressTraditional);
printerTraditional.print();
// => Sherlock Holmes
// => 221B Baker Street
// => London

/*
 * Without return values - Approach 1
 *
 * We use a defined setter on the instance which needs the data.
 */
interface HasAddressSetters {
  setName(value: string): HasAddressSetters;
  setStreet(value: string): HasAddressSetters;
  setCity(value: string): HasAddressSetters;
}

class AddressApproach1 {
  private readonly name: string;
  private readonly  street: string;
  private readonly city: string;

  constructor(name: string, street: string, city: string) {
    this.name = name;
    this.street = street;
    this.city = city;
  }

  setAddressValuesOn(object: HasAddressSetters) {
    object.setName(this.name).setStreet(this.street).setCity(this.city);
    return this;
  }
}

class StreetPrinterApproach1 implements HasAddressSetters {
  private name!: string;
  private street!: string;
  private city!: string;

  constructor(address: AddressApproach1) {
    address.setAddressValuesOn(this);
  }

  setName(value: string) {
    this.name = value;
    return this;
  }

  setStreet(value: string) {
    this.street = value;
    return this;
  }

  setCity(value: string) {
    this.city = value;
    return this;
  }

  print() {
    console.log(
      this.name + '\n' +
      this.street + '\n' +
      this.city
    );
    return this;
  }
}

const addressApproach1 =
  new AddressApproach1("Sherlock Holmes", "221B Baker Street", "London");
const printerApproach1 = new StreetPrinterApproach1(addressApproach1);
printerApproach1.print();
// => Sherlock Holmes
// => 221B Baker Street
// => London

/*
 * Without return values - Approach 2
 *
 * Instead of an interface, we use a callback to set the data on the instance
 * which needs it.
 */
class AddressApproach2 {
  private readonly name: string;
  private readonly street: string;
  private readonly city: string;

  constructor(name: string, street: string, city: string) {
    this.name = name;
    this.street = street;
    this.city = city;
  }

  setAddressValuesOn(
    object: object,
    callback: (name: string, street: string, city: string) => void
  ) {
    callback.call(object, this.name, this.street, this.city);
    return this;
  }
}

class StreetPrinterApproach2 {
  private name!: string;
  private street!: string;
  private city!: string;

  constructor(address: AddressApproach2) {
    address.setAddressValuesOn(this, this.setValues);
  }

  setValues(name: string, street: string, city: string) {
    this.name = name;
    this.street = street;
    this.city = city;
    return this;
  }

  print() {
    console.log(
      this.name + '\n' +
      this.street + '\n' +
      this.city
    );
    return this;
  }
}

const addressApproach2 =
  new AddressApproach2("Sherlock Holmes", "221B Baker Street", "London");
const printerApproach2 = new StreetPrinterApproach2(addressApproach2);
printerApproach2.print();
// => Sherlock Holmes
// => 221B Baker Street
// => London
