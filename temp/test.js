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
