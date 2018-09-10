I’ve been tipping a few mobs of this thing, but I wanted to document it here as well.

When we are doing such rapid code-test-code-test-code-loops it can be come very cumbersome to 

1. have many failing tests (psst `.skip` them - see above) and
2. to scroll past all the long output that our passing tests are producing.

Normally we should have only one failing test at the same time which will help us to focus and divide the problem at hand into smaller chunks.

One way to do that is to use another reporter for our test runner, mocha. Open `package.json` and find the `scripts` node. Here’s how the `test` script looks now:

```json
"test": "node ./node_modules/.bin/mocha --reporter spec --exit \"server/**/*.spec.js\" \"client/**/*.spec.js\"",
```

See that part that says `--reporter spec`, change it to `--reporter dot` and then rerun the tests.

The output in the terminal will now look something like this:

```bash
․․․․․․․․․․․․․․․․․․!!!!!!,,,,,․․․․․․

  24 passing (136ms)
  5 pending
  10 failing
```

(You might have to scroll up if you have many failing test. Psst... Don’t - use `.skip` to get one failing test at the time).

Here’s how to read that:

* Passing tests are indicated with a dot `.`
* Faling tests are indicated with an exclamation mark `!`
* Pending (skipped) tests are indicated with a comma `,`

This will help you to get a much tighter and readable feedback, minimizing scrolling through text and take the load of your brains of all the failing tests that you don’t need to care about.

### PS

There are a number of other reporters that could be useful. My two favorites are:

* `list` - creates sentences of the test description
* `min` - clears the terminal putting the test output at the top of the screen. Very readable

You can see (and play with!) all the mocha reporters by going `npx mocha --reporters` in the root of your project.