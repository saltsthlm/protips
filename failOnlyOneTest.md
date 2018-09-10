When more than one test is failing at the same time, try to get only one failing test.
An easy way to do that is to call `it.skip` to skip one test (or `describe.skip` for all the tests under it)

```it('a test that fails', () => { ... });
it('another test that fails', () => { ... })
it('oh no, not yet another test that fails', () => { ... })
```

becomes easier to manage one-by-one:

```it('a test that fails', () => { ... });
it.skip('another test that fails', () => { ... })
it.skip('oh no, not yet another test that fails', () => { ... })
```

When you run this the two tests that are _skipped_ will show up as pending and you can get back to it later