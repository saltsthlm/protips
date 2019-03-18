A key programmer skill is to make our code easier to read and understand. In fact this more important than to make the code fast, terse and easy for the computer to interpret. Or easy to write.

> “Indeed, the ratio of time spent reading versus writing is well over 10 to 1. We are constantly reading old code as part of the effort to write new code. ...[Therefore,] making it easy to read makes it easier to write.”

— Robert C. Martin (Uncle Bob Martin), [Clean Code: A Handbook of Agile Software Craftsmanship](https://www.goodreads.com/quotes/835238-indeed-the-ratio-of-time-spent-reading-versus-writing-is)



>  By continuously improving the design of code, we make it easier and easier to work with. This is in sharp contrast to what typically happens: little refactoring and a great deal of attention paid to expediently add new features. If you get into the hygienic habit of refactoring continuously, you'll find that it is easier to extend and maintain code.

— Joshua Kerievsky, [Refactoring to Pattern](https://en.wikipedia.org/wiki/Code_refactoring#cite_note-kerievsky-1)

The way that we make our code easier to read is through Refactoring. 

## What is refactoring?

Quite simply refactoring means that we write the same code in another (hopefully) better way. 

Formally it's [defined as](https://en.wikipedia.org/wiki/Code_refactoring): 

> **Code refactoring** is the process of restructuring existing computer code—changing the *factoring*—without changing its external behaviour.

And the best way to describe what it is is to dive in doing it. 

## A few simple refactorings

Refactorings are the things we do to change our code. There are [numerous](https://refactoring.com/catalog/) of these, but I wanted to share a few simple and powerful ones with you below:

### Remove dead code

The simplest refactoring I know of is to simply remove code that is not used, aka Dead code. Here's a silly example: 

```javascript
const hasDeadCode = () => {
  if (1 > 2) {
    return 'Yes!';
  }
  return 'No';
}
```

That second `return` will never be reached. 1 is always smaller than 2. 

No need to leave that around. Let's remove it. 



```javascript
const noDeadCode = () => {
  if (1 > 2) {
    return 'Yes!';
  }
}
```

Easier to read and understand. 

In fact, now that I see this maybe I start to understand the code better so that I can change it even more. For example, why is that check in there, at all? Now I see that it's silly and I can make it much shorter and sweeter: 

```javascript
const noDeadCodeSimple = () => 'Yes!';
```

### Rename

Another **very** simple and powerful refactoring is to simply give stuff better names. 

Check this code out: 

```javascript
const check = (p) => {
  return p.Age > 30;
}
```

That `p` parameter is a bit hard to understand. What is it really? It's a person, so let's call it that:

```javascript
const check = (person) => {
  return person.Age > 30;
}
```

Ok, that made it easier to read, if I read the code in the function. But when I call it `check` is not really a good name, right? `check` what? The`person` I can understand now, as I need to pass a `person` in, but what will it return and why?

Let's change the name to reflect what the function is doing to something like: 

```javascript
const isAgeAbove30 = (person) => {
  return person.Age > 30;
}
```

There! Very clear and easy to understand. When I call it now, it will be very clear to me what the function does, what I need to pass to it and what kind of result I will get back. 

### Replace comments with better naming

Combining the two first refactorings (Dead Code and renaming) leads us into another simple refactoring. 

> Take out unnecessary comments

I knew what you were thinking about that Dead code tip: `I'll just comment it out for now… I'll remove it later`

No! It is **NOT** better to comment it out. Take it out. Now. Should you worry about losing the code just make a commit for when you removed it. This is what source control is for. 

And should the code require a comment to be able to understand… you should probably rename it.  For example, let's check another version of that `check`-function again:

```javascript
/**
 * Returns true if the age is above 30
 * @param {A person to check the age for} p
 */
const check = (p) => {
  return p.Age > 30;
}
```

That comment, good as it is, is only needed since the code is harder to read. We can replace it with better naming: 

```javascript
const isAgeAbove30 = (person) => {
  return person.Age > 30;
}
```

Bom! I understand the code perfectly well, without the comment. Shorter, and easier to understand. 

A final comment on comments (hehe) - they are not changed as I change the code. 

```javascript
/**
 * Adds the two numbers
 * @param {first number} a
 * @param {second number} b
 */
const subtract = (a, b) => a-b;
```

The comment is nice but totally wrong. No way for JavaScript to pick that up, since it's a comment. 

Comment as little as possible and only add things that you cannot express in code, and that does not change as the code change. For example only intent of the method not about the implementation of it. 

### Extract function

A more proper and little bigger refactoring is to extract a method. Quite simply we are making a new function out of a block of code in our function. 

Consider this code:

```javascript
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
```

There's a lot of small checks in there. Reading all of that code becomes really hard and tiresome after awhile. Also testing one of the validations, for example, that last one on name length would be really tricky as I need to set up a `person` object that passes all the checks above it. 

Let's move that last part out to another function:

```javascript
const isNameLengthInvalid = (person) => person.Name.length < 0;
```

(Yes, we are going to talk about the naming soon)

If we did that for all the other check's in  `isPersonValid` that function would look something like this: 

```javascript
const isPersonValid = (person) => {
  if(
  isAgeTooHigh(person) ||
  isAgeTooHigh(person) || 
  isNameLengthInvalid(person)) {
    return false;
  }
  return true;
}
```

Easier to read (although about 200 checks are missing) and understand. But more importantly - we can now test each of those small parts individual. 

However, now the naming looks a bit strange because those checks are all checking the bad state. Let's **RENAME** refactor to tell us when it's valid:

```javascript
const isNameLengthValid = (person) => person.Name.length > 0;
```

And change the age check to this:

```javascript
const isAgeValid = (person) => person.Age > 0 && person.Age < 120;
```

And then change how we call it in the `isPersonValid` function, in all places to make it into this:

```javascript
const isPersonValid = (person) => {
  return
    isAgeValid(person) &&
    // 200 more checks
    isNameLengthValid(person);
}
```

Now, even if the checks are plentiful, they are easy to follow and read. Thank you refactoring!

### Inline function

Inlining a function is the opposite of the **EXTRACT** refactoring; we take the code from a function and just put it in our code. 

For example, consider the following silly example:

```javascript
const isNameLengthValid = (person) => person.Name.length > 0;
```

That's 63 characters, to do the one thing that is important: `person.Name.length > 0` (22 chars). 

Let's inline it! Before we did:

```javascript
if(isNameLengthValid(person))
```

and after inlineing that function we instead say:

```javascript
if(person.Name.length > 0)
```

Now… is that better? Well… it depends. What do you think? 

Now we come to the case where we need to reason and use our brain. There are parts of coding that is a little bit like art and cannot be described in black or white. Here's one of those places. 

On the one side, this is so easy that it's not really hard to read. On the other hand, extracting the function would make that part of the code easier to test. 

You decide

### Extracting callbacks

There's a special case of refactoring in JavaScript that will come in handy. It's just **EXTRACT FUNCTION** but in the case of callbacks we very often start off with the callback **INLINED FUNCTION** 

Consider the following call:

```javascript
const fetch = require('node-fetch');

fetch('https://randomuser.me/api/?results=500')
  .then(res => res.json())
  .then(data => data.results.filter(d => d.gender === 'female'))
  .then(women => women.filter(w => w.nat === 'GB'))
  .then(womenInGB => womenInGB.map(wgb => {
    const age = new Date(new Date() - new Date(wgb.dob.date)).getFullYear() - 1970;
    return {
      name: `${wgb.name.title} ${wgb.name.first} ${wgb.name.last}`,
      age: age
    };
  }))
  .then(r => console.log(r));
```

Each of those `.then()` functions take a callback function… and all of them are now inlined. With increasing degrees of ~~stupidity~~ complexity. Let's fix them by extracting them. 

First let's extract the second to last callback (that starts `.then(womenInGB => womenInGB.map(wgb => {`). We'll create a function like this: 

```javascript
const createPersonFromUser = user => {
  const age = new Date(new Date() - new Date(user.dob.date)).getFullYear() - 1970;
  return {
    name: `${user.name.title} ${user.name.first} ${user.name.last}`,
    age: age
  }
}
```

In fact, we can extract another function from that… Let's fix that age-calculator too: 

```javascript
const calculateAge = d => new Date(new Date() - new Date(d)).getFullYear() - 1970;

```

Which in turn cleans up the `createPersonFromUser` too: 

```javascript
const createPersonFromUser = user => {
  return {
    name: `${user.name.title} ${user.name.first} ${user.name.last}`,
    age: calculateAge(user.dob.date)
  }
}
```

In fact, let's pull out two more callback functions from the `.then()`'s: 

```javascript
const onlyWomenFromResult = (data) => data.results.filter(d => d.gender === 'female');
const onlyGBUsers = (data) => data.filter(w => w.nat === 'GB');
```

Once that is done our original code looks like this: 

```javascript
fetch('https://randomuser.me/api/?results=500')
  .then(res => res.json())
  .then(data => onlyWomenFromResult(data))
  .then(women => onlyGBUsers(women))
  .then(womenInGB => womenInGB.map(wgb => createPersonFromUser(wgb)))
  .then(r => console.log(r));
```

By doing that we 

1. Easier understand the code
2. Wrote more generic code (notice that `onlyGBUsers` doesn't care if it operates on women users or not, for example)
3. We can test the code's individual parts, without calling the `fetch()`. 
   1. We can test the `calculateAge` without even passing it a user, just a date
   2. We can `createPersonFromUser` by just passing `user` that we create in the test. 
   3. etc

Before we dive deeper into the testing part, let's clean this code up some more and show the final part

```javascript
const fetch = require('node-fetch');

const calculateAge = d => new Date(new Date() - new Date(d)).getFullYear() - 1970;
const createPersonFromUser = user => {
  return {
    name: `${user.name.title} ${user.name.first} ${user.name.last}`,
    age: calculateAge(user.dob.date)
  }
}
const createPeopleFromUser = users => users.map(wgb => createPersonFromUser(wgb));
const onlyWomenFromResult = (data) => data.results.filter(d => d.gender === 'female');
const onlyGBUsers = (data) => data.filter(w => w.nat === 'GB');

fetch('https://randomuser.me/api/?results=500')
  .then(res => res.json())
  .then(onlyWomenFromResult)
  .then(onlyGBUsers)
  .then(createPeopleFromUser)
  .then(r => console.log(r));
```

Now the code is both shorter and easier to read. I've also made use of the ES6 feature that when a callback only takes one parameter it is automatically passed to the function. So

```javascript
.then(data => onlyWomenFromResult(data))
```

is the same as to write: 

```javascript
.then(onlyWomenFromResult)
```

## Refactoring with tests - refactor to test

So, by now you understand that Refactoring is both cool, fun and very important.

However, making a structural change to the code, without having a way to check if the code still behaves the same way, is very dangerous. How would you know if you broke something? Well… you have (automated) tests that test the functionality of the code separate from the structure of the code. 

In a very strange case of reflective relationship, as you refactor the code also get easier to test. 

Consider the following code (yes I'm reusing the example, call me lazy if you want):

```javascript
const fetch = require('node-fetch');

fetch('https://randomuser.me/api/?results=500')
  .then(res => res.json())
  .then(data => data.results.filter(d => d.gender === 'female'))
  .then(women => women.filter(w => w.nat === 'GB'))
  .then(womenInGB => womenInGB.map(wgb => {
    const age = new Date(new Date() - new Date(wgb.dob.date)).getFullYear() - 1970;
    return {
      name: `${wgb.name.title} ${wgb.name.first} ${wgb.name.last}`,
      age: age
    };
  }))
  .then(r => console.log(r));
```

Not only is this code not refactored and hard to read and understand but it's also totally untestable:

* First - I cannot test the individual parts but have to run the whole thing
* Secondly - I have to call `fetch()` every time which makes the call slow(-ish) and unreliable. In this case, I actually get a different result for every call, hence the name of the API `randomuser.me`

Let's fix both of these things by some simple refactorings… This time using tests. 

First we pull out the date calculation to this, again: 

```javascript
const calculateAge = d => new Date(new Date() - new Date(d)).getFullYear() - 1970;

//... way at the bottom of the file
module.exports = {
  calculateAge
}
```

And now we can make some tests around that function, like this:

```javascript
const womenFetcher = require('./')
const assert = require('assert')

describe('Age calculator', () => {
  it('works for young', () => {
    const age = womenFetcher.calculateAge(new Date(2018, 1, 1));
    assert.equal(1, age);
  })
})
```

Pretty cool. We should add more test of course, but I'll press on now. Let's **EXTRACT** the function that parses users to our person object. Here's the function: 

```javascript
const createPersonFromUser = user => {
  return {
    name: `${user.name.title} ${user.name.first} ${user.name.last}`,
    age: calculateAge(user.dob.date)
  }
}

//...
module.exports = {
  calculateAge,
  createPersonFromUser
}
```

(Notice that it uses `calculateAge` internally)

And here's a bunch of tests that verifies that functionality:

```javascript
describe('Parses users to people', () => {
  let person = {}
  let user = {}

  beforeEach(() => {
    user = {
      name: {
        title: 'Mrs',
        first: 'Marcus',
        last: 'Gribbe'
      },
      dob: {
        date: new Date(2018, 1, 1)
      }
    }
    person = womenFetcher.createPersonFromUser(user);
  })

  it('sets the title from the user', () => {
    assert.equal(true, person.name.includes(user.name.title));
  })
  it('sets the first name from the user', () => {
    assert.equal(true, person.name.includes(user.name.first));
  })
  it('sets the last name from the user', () => {
    assert.equal(true, person.name.includes(user.name.last));
  })
  it('sets the age from the user', () => {
    assert.equal(1, person.age);
  })
})
```

For the different parsing parts, we can do the same. Let's see how we can test the parsing of only women the JSON from `fetch`, without being dependent on `fetch`. 

First, let's **EXTRACT** that function: 

```javascript
const onlyWomenFromResult = (data) => data.results.filter(d => d.gender === 'female');

//..
module.exports = {
  calculateAge,
  createPersonFromUser,
  onlyWomenFromResult
}
```

Cool - now let's create a test for this function:

```javascript
describe('Filter only women', () => {
  it('list only women', () => {
    const data = {
      results: [
        { gender: 'male' },
        { gender: 'female' },
        { gender: 'female' }
      ]
    }

    const onlyWomen = womenFetcher.onlyWomenFromResult(data);
    assert.equal(2, onlyWomen.length);
  })
})
```

Noteworthy in this test is that when I create the fake `data` object, I only need to include the properties that I'm interested in. In this case `gender`. This makes my test less brittle and sensitive to changes. 

### Conclusion testing

We could then continue to **EXTRACT** methods like this and make the parts of the application testable. But that's a bit beyond the scope of this post. I'll leave that as an exercise for you. 

But, now, with these tests in place, I could make a lot of changes to my code knowing that it still works. The tests would tell me if any change would break the code. 

As an exercise change `calculateAge` to use [moment.js](https://momentjs.com/) instead. Keep running the tests and you would know if your changes still work

## Conclusion refactoring

Oh man, that was a long post. Sorry about that.

BUT, not sorry really; refactoring is a key skill. When we are refactoring the code we make it easier to read and to understand. We are simply not done just because the code works - it has to be clean and understandable too. 

When we refactor we also drive up the need for automated tests, that protect us from making mistakes. This is great, but interesting enough, refactoring the code also makes it easier to test.