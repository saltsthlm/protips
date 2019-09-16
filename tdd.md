**This site is deprecated and all the content has moved to [AppliedTechnology](https://appliedtechnology.github.io/protips/)**

# TDD - Test driven development

Test driven development means that we write code that test our code. Not only that but we write the test code before we write our (production) code.

By doing this we gain many Good Things (TM):

* We think about WHAT the code should do before we think about HOW it should do that
* We get an opportunity to break down the problem at hand into smaller steps, in small tests
* We get an executable documentation that describes the code. The test will tell us if we changed something that broke our previous assumptions of the code
* We get tests of our code that helps us to ensure that the system does what it intend to do.
* Writing testable code (code that can be tested with other code) often leads to better, easier to understand code

Writing tests is not that hard, but gets hard the longer you wait. The time to write the test is just before you write the code.

## Frameworks

Common JavaScript test frameworks are [mocha](https://www.npmjs.com/package/mocha) and [jest](https://www.npmjs.com/package/jest). These frameworks are used both to write the test and to run them.

## Red Green Refactor

When we work test driven we follow the Red-Green-[Refactor](https://saltsthlm.github.io/protips/refactoring)-loop.

* Red - first write a failing test, that tests some functionality that not yet exists. This should fail when we run the test, since the code doesn't yet exists. It fails for the correct reason.

* Green - make the test pass in the simplest way, for example by returning a constant. This ensures that our test and production code behaves and interacts in the correct way.

* Refactor - now make it correct, changing the code into something that we think would hold up.

Let's test it in (very simplified) practice; by writing an add function.

Set up the code:

```bash
mkdir tdddemo && cd tdddemo && npm init -y && npm i mocha
npx gitignore node
touch adder.js adder.test.js
code .
```

In the `package.json` file add the following script in the `test` script:

```json
"scripts": {
  "test": "mocha *.test.* -R list"
}
```

For our **RED** step - let's write a simple test in the `adder.test.js` file:

```javascript
const adder = require('./adder.js');
const assert = require('assert');

describe('Adder feature', () => {
  it('1+1 = 2', () => {
    const sum = adder.add(1, 1)
    assert.equal(2, sum);
  });
});

```

* Notice that we are referencing the `adder.js` and `add` function - although that doesn't exists yet.
* We are also stating WHAT the code should do very clearly; if 1 and 1 is sent to the `add` function - then 2 should be returned

Let's run it: `npm t` .

Actually - before you do that - stop for awhile here and state what you *think* will happen. Done? Ok - go on.



That fails, of course, since we have not yet created the function `add` in the `adder.js` file:

```bash
TypeError: adder.add is not a function
```

Exactly what we thought. Right? Did you notice that the error was reported in **RED**? We are in the **RED** state of the loop.

Our only job now is to get to **GREEN**. We are not allowed to change any code when the tests are **RED**. Because then we don't know what we are breaking. If we are on **GREEN** and change code it will tell us if we are breaking anything (by going RED).

Ok - let's make that test pass with as little code as possible. Let's go to **GREEN**. In the `adder.js` file, write this, for example:

```javascript
module.exports.add = () => 2;
```

That is the simplest I can come up with. But does it work?

What do you think will happen when we run `npm t` . Have an idea? Ok - let's try it. Run `npm t` .

Yes - it's passes. In **GREEN** it's now reported that the test pass:

```bash
  ✓ Adder feature 1+1 = 2: 0ms

  1 passing (3ms)
```

But - that's not really the code we need, right? `add` will always return 2. We can probably figure out the proper implementation, but let's write another test to prove that our code right now is not good enough. Add the following test to `adder.test.js`

```javascript
  it('41+1 = 42', () => {
    const sum = adder.add(41, 1)
    assert.equal(42, sum);
  });
```

Now that we run the tests (think about what you think will happen and then`npm t`) we are on **RED** again:

```bash
  ✓ Adder feature 1+1 = 2: 0ms
  1) Adder feature 41+1 = 42

  1 passing (6ms)
  1 failing

  1) Adder feature
       41+1 = 42:

      AssertionError [ERR_ASSERTION]: 42 == 2
      + expected - actual

      -42
      +2
```

One test is passing but one is failing. As we thought.

Let's get to **GREEN** as fast as possible. And the fastest way is to write a more proper implementation:

```javascript
module.exports.add = (a, b) => a + b;
```

`npm t` shows us that it works as intended. Now that we are on **GREEN** we can actually make the code a bit better. Let's **REFACTOR** before we call it a day.

I don't like the parameter names `(a, b)` and I don't like that we are exporting the function right out like that. I'm gonna change it a bit, like this:

```javascript
// These are the formal names https://math.stackexchange.com/questions/975541/what-are-the-formal-names-of-operands-and-results-for-basic-operations
const add = (augend, addend) => augend + addend;

module.exports = {
  ad: add
}
```

Cool - let's rerun with `npm t` and it WHAAT?! It fails with a glaring **RED** message:

```bash
  1) Adder feature 1+1 = 2
  2) Adder feature 41+1 = 42

  0 passing (4ms)
  2 failing

  1) Adder feature
       1+1 = 2:
     TypeError: adder.add is not a function
      at Context.<anonymous> (adder.test.js:6:23)
      at processImmediate (internal/timers.js:439:21)

  2) Adder feature
       41+1 = 42:
     TypeError: adder.add is not a function
      at Context.<anonymous> (adder.test.js:10:23)
      at processImmediate (internal/timers.js:439:21)
```

Ah, stupid fingers. Spelling misstake in the exports. Luckily the tests showed me that I messed up.

```javascript
// These are the formal names
// https://math.stackexchange.com/questions/975541/what-are-the-formal-names-of-operands-and-results-for-basic-operations
const add = (augend, addend) => augend + addend;

module.exports = {
  add
}
```

Now it works and we are one `npm t` from **GREEN**.

The [code is found here](https://github.com/saltsthlm/protips-code/tree/master/tdddemo)

## Conclusion

Test driven development helps us to write our code in small, controlled and deliberate steps.

When doing TDD we write the test before we write the production code.

By using TDD we get better code that is easier to understand, and documentation and that will tell us if we break the code already written.