const checkIt = (value) => {
  if (isNaN(value)) {
    // throw new TypeError('Not the error you expected')
    throw new TypeError('Please, only numbers to this function')
  }
  if (value < 0) {
    throw new Error('Cannot be below 0')
  }
  return value > 1
}

module.exports.checkIt = checkIt
