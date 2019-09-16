**This site is deprecated and all the content has moved to [AppliedTechnology](https://appliedtechnology.github.io/protips/)**

When we are writing testing code we sometimes need to test that our code is handling errors in a correct way - test the error handling in other words.

Imagine that you have the following simple function in a `index.js`-file

```javascript
const checkIt = (value) => {
  return value > 1
}

module.exports.checkIt = checkIt

```

This can then be tested with these tests in `tests.js`

```javascript
/* global describe, it */

const assert = require('assert')
const systemUnderTest = require('./index')
// const systemUnderTest = require('./')

describe('how to test that somethings throws', () => {
  it('returns true if the value is above 1', (done) => {
    assert.equal(systemUnderTest.checkIt(2), true)
    done()
  })

  it('returns false if the value is below 1 but above 0', (done) => {
    assert.equal(systemUnderTest.checkIt(1), false)
    done()
  })
})

```

### Sidebar: How to run these tests

1. Create a new empty directory ('mkdir testingErrors && cd testingErrors')
2. `npm init -y` to create a `package.json`
3. `npm install mocha -D` to install and save Mocha, that is our test runner
4. Update package.json script `test` to this `mocha --watch *.js -R list`
5. `npm test` to run the tests

## Testing errors

Ok that is fine, but that code is a bit instabile. What if someone sends us less than 0... That is obviously (joking here, but play along) wrong and should throw an error telling the user that.

I want the code to be like this:

```javascript
const checkIt = (value) => {
  if (value < 0) {
    throw new Error('Cannot be below 0')
  }
  return value > 1
}

module.exports.checkIt = checkIt

```

Here's is how I would write a test to verify that it happens when I expect it

```javascript
it('does throw an Error if the value is below 0', (done) => {
    assert.throws(
      () => {
        systemUnderTest.checkIt(-1)
      },
      {
        name: 'Error',
        message: 'Cannot be below 0'
      }
    )
    done()
  })
```

Let's walk through the code:

* I'm using `assert.throws` ([see this](https://nodejs.org/api/assert.html#assert_assert_throws_fn_error_message)) that has a bit of a particular syntax. It takes two parameters:
  * A callback function that it will execute to get the exception
  * The second parameter is the expected Error
* In the callback we call the `checkIt` function as before, with a parameter that creates the error
* The second parameter `{ name: 'Error', message: 'Cannot be below 0'}` describes the errors type and message.

When we run this Mocha will expect an error to thrown, by the callback function and will pass if the error is a `Error` with the message  `Cannot be below 0`

### Another one

Let's do one more. Let's say that we want to check that the sent in value is a number and not a stupid string, since we are going to check if it is greater than one.

```javascript
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

```

We now know how to test that:

```javascript
it('does throw a TypeError if the value is not a number', (done) => {
    const expectedError = new TypeError('Please, only numbers to this function')

    assert.throws(
      () => {
        systemUnderTest.checkIt('Ho ho Marcus doing crazy stuff')
      },
      expectedError
    )
    done()
  })
```

The only difference here is that I set up the expected error, as a separate value before I call the `assert.throws`

## But how do I check that it doesn't throw?

Well there's actually a function for that too, in the standard `assert` library.

```javascript
it('not throw an error if the value is above 1', (done) => {
    assert.doesNotThrow(
      () => {
        systemUnderTest.checkIt(1)
      },
      SyntaxError
    )
    done()
  })

```

This code simply verifies that a `SyntaxError` is not thrown when 1 is pass to the `checkIt`-function

## All the code

Here's all the code. First the `index.js`-file

```javascript
const checkIt = (value) => {
  if (isNaN(value)) {
    throw new TypeError('Please, only numbers to this function')
  }
  if (value < 0) {
    throw new Error('Cannot be below 0')
  }
  return value > 1
}

module.exports.checkIt = checkIt

```

And here are the tests, that checks for errors:

```javascript
const assert = require('assert')
const systemUnderTest = require('./index')

describe('how to test that somethings throws', () => {
  it('returns true if the value is above 1', (done) => {
    assert.equal(systemUnderTest.checkIt(2), true)
    done()
  })

  it('returns false if the value is below 1 but above 0', (done) => {
    assert.equal(systemUnderTest.checkIt(1), false)
    done()
  })

  it('not throw an error if the value is above 1', (done) => {
    assert.doesNotThrow(
      () => {
        systemUnderTest.checkIt(1)
      },
      SyntaxError
    )
    done()
  })

  it('does throw an Error if the value is below 0', (done) => {
    assert.throws(
      () => {
        systemUnderTest.checkIt(-1)
      },
      {
        name: 'Error',
        message: 'Cannot be below 0'
      }
    )
    done()
  })

  it('does throw a TypeError if the value is not a number', (done) => {
    const err = new TypeError('Please, only numbers to this function')

    assert.throws(
      () => {
        systemUnderTest.checkIt('Ho ho Marcus doing crazy stuff')
      },
      err
    )
    done()
  })
})

```

## Conclusion

I hope that this made testing for errors a bit simpler to grasp.