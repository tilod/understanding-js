'use strict'

// Error handling in promises vs. async functions

const promiseFn = (number) => {
  return new Promise((resolve, reject) => {
    if (number > 0) {
      resolve(number * 2);
    } else {
      reject('Nope');
    }
  });
};

const asyncFn = async (number) => {
  if (number > 0) {
    return number * 2;
  } else {
    throw 'Nope';
  }
}

promiseFn(2).then(console.log).catch(console.log);
promiseFn(-1).then(console.log).catch(console.log);
asyncFn(2).then(console.log).catch(console.log);
asyncFn(-1).then(console.log).catch(console.log);
