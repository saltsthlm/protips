const isNegative = number => {
  return new Promise((resolve, reject) => {
    if (number < 0) {
      reject(Error(`${number} is negative`));
    }
    resolve(`${number} is positive`);
  });
}

isNegative(4)
  .then(res => console.log(res))
  .catch(err => console.log(err.message))
