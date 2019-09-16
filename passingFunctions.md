**This site is deprecated and all the content has moved to [AppliedTechnology](https://appliedtechnology.github.io/protips/)**

# Callbacks part I - functions as parameters

This blog post can also be [viewed as a screencast](https://youtu.be/rhD6_jdZkK8), if you rather hear it than read it.

## Introduction

One pattern that is used in many places in our code is the concepts of callbacks. They are quite tricky to wrap your head around but once you've untangled them they become second nature.

In this little post I wanted to explain a language construct that I've seen led to some confusions: passing functions as parameters.

## Functions as parameters

JavaScript has a really amazing feature in that you can pass functions as parameters. Like this:

```javascript
const hiSayer = function () {
  console.log('HI!')
}

function main(fn) {
  console.log('About to call a function passed to me');
  console.log(fn);
  fn();
}

main(hiSayer);
```

(Save this code as `index.js` and then run it with. `node index.js`)

On the first line we are creating an (anonymous) function that writes `HI!` to the console. We store this function in constant called `hiSayer`

The `main` function takes a parameter `fn`, writes a few statements to the console (the type of the parameter for example... what is that?) and then calls the `fn`-parameter as a function by using `fn();`

Finally we call the main function and passing it the `hiSayer` function as the `fn` parameter. Hence `hiSayer` will be called inside `main`.

### Parameter passing

We could make the `hiSayer`-function a bit more flexible by passing a parameter with the name to who we are going to say hi to. It would look like this:

```javascript
const hiSayer = function (name) {
  console.log(`HI ${name}!`)
}

function main(nameToGreet, fn) {
  console.log('About to call a function passed to me');
  console.log(fn);
  fn(nameToGreet);
}

main('Marcus', hiSayer);
```

Now we are passing a string `name` to the anonymous function. This string is actually a parameter to the `main`-method too, which means that we can decide (bind) the value of the string when we execute the program on the last line.

### Shorter syntax

Actually, this is a bit clunky - let's shorten it up and take out those extra `console.log`-statements. Like this:

```javascript
const hiSayer = name => console.log(`HI ${name}!`);

const main = (nameToGreet, fn) => fn(nameToGreet);

main('Marcus', hiSayer);
```

Oh! Much sweet! Much nice!

This code is equivalent with the previous version, but shorter, and (objectively) easier to read.

A few things to note:

* `hiSayer = function (name) {` becomes `hiSayer = name =>`
  * If there's more than one parameter you will need parantheis around the parameters (`main = (nameToGreet, fn) =>` for example)
  * A special case is when there's zero parameters to a function, in which case we also need parentheses ```const currentDate = () => return Date() ```
* When there's only one statement in a function you don't need curly braces
  * And can bring it up on one line, creating what's known as a one-liner

### Inlining functions

In fact ... the function is so short now, that you could ask yourself why we need it at all. Only one line?! Come on! Let's write it *inline*, just when we need it. Like this:

```javascript
const main = (nameToGreet, fn) => fn(nameToGreet);

main('Marcus', name => console.log(`HI ${name}!`));
```

This is pretty cool! Just as we did with that beautiful name parameter, we can decide (bind) the function just where we need it.

Check the definition of the`main`-function again:

* it takes a `nameToGreet` (bound to `Marcus` when we call it, on the last line) and
* the second parameter `fn` is a function. Bound to ```name => console.log(`HI ${name}!`)``` when we call it.

### More than one line

Of course the function doesn't have to be one line just because we write it inline. But then you need the curly-braces back in - only function that are only one line can skip those

Here's an example:

```javascript
const main = (nameToGreet, fn) => fn(nameToGreet);

main('Marcus', name => {
  const upper = name.toUpperCase()
  console.log(`HI ${upper}!`);
});
```

The function is now wrapped in curly braces. And just as final reminder - that last part could be written, old-school and bloated, like this:

```javascript
const main = (nameToGreet, fn) => fn(nameToGreet);

main('Marcus', function (name) {
  const upper = name.toUpperCase()
  console.log(`HI ${upper}!`);
});
```

See that `});` at the end there. It's there because the curly brace ends the definition of the function and the paranthesis ends the parameter list to the `main`-function. And then the semicolon which is there for our sins.

### Summary

Passing functions as parameters is a very powerful construct and can be abbreviated quite a lot. But that it's short and powerful also makes it a little bit harder to read.

I hope that this post made it a bit clearer.

Now you are well equipped to read the next part of this series - [calling back](https://saltsthlm.github.io/protips/callingBack).