When more than one test is failing at the same time, try to get only one failing test.

There are two main approaches to do so `only` and `skip`.

## Only
To run only one test, find the test in question and change from

```javascript
it('a test that fails', () => { ... });
it('another test that fails', () => { ... });
it('oh no, not yet another test that fails', () => { ... });
```

to

```javascript
it.only('a test that fails', () => { ... });
it('another test that fails', () => { ... });
it('oh no, not yet another test that fails', () => { ... });
```

This will run, only, the 'a test that fails'-test.

You can also use `.only` on a `describe`-block, to only run the tests in that `describe` block. Like this:

```javascript
describe.only('Tests that fails', () => {
  it('a test that fails', () => { ... });
  it('another test that fails', () => { ... });
});

describe('Tests that works', () => {
  it('oh no, not yet another test that fails', () => { ... })
});
```

Now, only the 'Tests that fails'-test**s** will run. Both of them.

## Skip
Another easy way to do that is to call `it.skip` to skip one test (or `describe.skip` for all the tests under it).

```javascript
it('a test that fails', () => { ... });
it('another test that fails', () => { ... })
it('oh no, not yet another test that fails', () => { ... })
```
becomes easier to manage one-by-one:

```javascript
it('a test that fails', () => { ... });
it.skip('another test that fails', () => { ... })
it.skip('oh no, not yet another test that fails', () => { ... })
```

The benefit of using `.skip` is that when you run this the two tests that are _skipped_ will show up as pending and you can get back to it later