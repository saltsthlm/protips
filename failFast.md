Writing code in JavaScript often contains a lot of checking that things are defined, present or containing the data we are looking for. This can lead to very complicated expressions that are hard to read.

But there's a better way; it's called defensive coding or *fail fast*.

Let's take a case of a parsing a cookie if you ever need to do that.

Let's say that we have a function called `isValidCookie` that is supposed to return `true` when the cookie is valid and `false` when the cookie is not valid.

We even have a few tests for this:

```javascript
it('should reject undefined cookie', () => {
    assert(!svc.isValidCookie(undefined));
});
it('should reject empty string cookie', () => {    assert(!svc.isValidCookie(''));
});
it('should reject cookie without auth.status key', () => {    assert(!svc.isValidCookie('foo=bar'));
});
it('should accept cookie with auth.status key', () => {    assert(svc.isValidCookie('foo=bar;auth.status=apa'));
});
```

Here's the empty implementation of `isValidCookie`

```javascript
const isValidCookie = cookie => {
};
```

If we approach this defensively we could write out function like this, to pass test by test.

## 'should reject undefined cookie'
So, if the cookie is undefined we should return false. Simple enough:

```javascript
const isValidCookie = cookie => {
  if(cookie === undefined) {
    return false;
  }
};
```

If the cookie is undefined we can't do anything more with it and just leave the function as fast as possible.

The first test passed. On to the next.

## 'should reject empty string cookie'

Well, let's just add another check

```javascript
const isValidCookie = cookie => {
  if(cookie === undefined) {
    return false;
  }

  if(cookie === '') {
    return false;
  }
};
```

Same here. Empty string - we don't want. Bail out of the function.

(I could have written the check in one expression if I wanted but I'll leave that as an exercise for you to figure out)

## 'should reject cookie without auth.status= key'

This test is another check where we cannot continue if `auth.status=` is not present. Let's just check for that too:

```javascript
const isValidCookie = cookie => {
  if(cookie === undefined) {
    return false;
  }

  if(cookie === '') {
    return false;
  }

  if(!cookie.indexOf('auth.status=')) {
    return false;
  }
};
```

Now I'm just gonna check if this string is present. If not - return fast. Fail fast.

## Final test and pay-off of this approach

The final test (that we have specified in our test suite) will now be very easy to implement.

```javascript
const isValidCookie = cookie => {
  if(cookie === undefined) {
    return false;
  }

  if(cookie === '') {
    return false;
  }

  if(!cookie.indexOf('auth.status=')) {
    return false;
  }

  return true;
};
```

Since we have returned out of our function if the cookie is not as expected we can actually just return true.

On the line after all the if-statements we know:

* the cookie is not undefined
* the cookie is not an empty string
* the cookie contains 'auth.status='

So here we can safely do things like `cookie.split('auth.status=')` and know that it would work.

(In our case, with only these tests, we can just return true, because that's all that our tests instructed us to do)

# Summary
Failing fast is a very good strategy when it comes to writing good, easy to read code.
The basic idea is that you want to test the arguments that the code is using to see that they are in a state that we can use.

If not - fail fast. Exit the function as early as possible.