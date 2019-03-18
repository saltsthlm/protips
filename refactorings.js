// Remove dead code
const hasDeadCode = () => {
  if (1 > 2) {
    return 'Yes!';
  }
  return 'No';
}

const noDeadCode = () => {
  if (1 > 2) {
    return 'Yes!';
  }
}

const noDeadCodeSimple = () => 'Yes!';

// Rename
const check = (p) => {
  return p.Age > 30;
}

const check = (person) => {
  return person.Age > 30;
}

const isAgeAbove30 = (person) => {
  return person.Age > 30;
}

// Remove comments

/**
 * Returns true if the age is above 30
 * @param {A person to check the age for} p
 */
const check = (p) => {
  return p.Age > 30;
}

/**
 * Adds the two numbers
 * @param {first number} a
 * @param {second number} b
 */
const subtract = (a, b) => a-b;

// Extract function
const isPersonValid = (person) => {
  if(person.Age < 0) {
    return false;
  }

  if(person.Age > 120) {
    return false;
  }

  // ...
  // And then 200 more checks
  //

  if(person.Name.length < 0) {
    return false;
  }

  return true;
}

const isNameLengthInvalid = (person) => person.Name.length < 0;
const isAgeTooLow = (person) => person.Age < 0;
const isAgeTooHigh = (person) => person.Age > 120;

const isPersonValid = (person) => {
  if(
    isAgeTooHigh(person) ||
    isAgeTooHigh(person) || 
    isNameLengthInvalid(person)) {
      return false;
    }
    return true;
  }
}
const isNameLengthValid = (person) => person.Name.length > 0;
const isAgeValid = (person) => person.Age > 0 && person.Age < 120;

const isPersonValid = (person) => {
  return
    isAgeValid(person) &&
    // 200 more checks
    isNameLengthValid(person);
}