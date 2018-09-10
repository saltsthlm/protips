The tests that we are writing becomes the documentation (or specification) for how our code should behave. Therefor it’s really important to write clear and easy to understand test.

They are also much easier to manage if each test only tests one single thing.

Compare these two test-sections:
```javascript
it('a newly created user is a valid user', done => {
    const user = createNewUser();
    assert.notEqual(user.name, '');
    assert.notEqual(user.name, 'Marcus');
    assert.equal(user.age < 1, true);
})
```

to

```javascript
it('a newly created user username cannot be empty ', done => {
	const user = createNewUser();
	assert.notEqual(user.name, '');
})
it('a newly created user username cannot be Marcus ', done => {
	const user = createNewUser();
	assert.notEqual(user.name, 'Marcus');
})
it('a newly created user age cannot be less than 0', done => {
	const user = createNewUser();
	assert.equal(user.age < 0, true);
})
```

If the age setting functionality is changed and validates the rules the message, for the failing test, will be much clearer in the second batch of tests