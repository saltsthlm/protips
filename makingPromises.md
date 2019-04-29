When I first heard about promises I got pretty confused and actually had a period where I rather did callbacks than Promises.

But then I got to know how to make my own promise and it all made a whole lot of sense.

Let's make a dead simple little function that checks if a number is negative or not. But, let's make it into a promise.

(You should understand something about [passing functions as parameters](https://saltsthlm.github.io/protips/passingFunctions.html) and what [callbacks are](https://saltsthlm.github.io/protips/callingBack.html) before reading this post)

```javascript
const isNegative = number => {
  return new Promise((resolve, reject) => {
    if (number < 0) {
      reject(Error(`${number} is negative`));
    }
    resolve(`${number} is positive`);
  });
}
```

This looks a bit convoluted so let's got through it slowly.

* Promises are created with the constructor, that gets called by going `new Promise()`.
* The Promise constructor () takes a function as it's only parameter.
  * This function has two parameters:
    * `resolve` - a callback function that we will call when the work is completed without errors
    * `reject` - a callback function that we will call when the work fails for some reason
* In our code we then just check if the number is negative or not (`if (number < 0)`) and `reject` or `resolve` the promise.

## Promises Terminology
Before we move on let's go through some terminology. Oh, I stole [this from here](https://developers.google.com/web/fundamentals/primers/promises). A promise can be:

* **fulfilled** - The action relating to the promise succeeded
* **rejected** - The action relating to the promise failed
* **pending** - Hasn't fulfilled or rejected yet
* **settled** - Has fulfilled or rejected

## Terminology for our code

As we enter the function `isNegative` the promise is **pending**, as in we are waiting for a result from it.

When we call `reject` on line 3 of the function the promise gets **rejected**.

If the number is not negative we end up on line 5 and the promise is **fulfilled**

Once the function has executed and we have done either `reject` or `resolve` then the promise is **settled**

Speaking of - let's call our promise.

## Calling and then-ing promises
Calling to our new promise function is very simple:

```javascript
isNegative(4)
```

And if you do that ... nothing happens. But if you were to console.log it

```javascript
console.log(isNegative(4))
```

you would see something like `Promise { '4 is positive' }`. The promise is not yet fulfilled. If our function were to take time this would say `Promise <Pending>` (we'll see this later)

In order to make use of our promisfied function, we need to receive the call to the `reject` or `resolve` somewhere. This place is `.then()`.

```javascript
isNegative(4)
  .then(res => console.log(res))
  .catch(err => console.log(err.message))
```

* `.then` - is what will be called when we invoke `resolve` in the `isNegative` function. We will receive the result in a callback function parameter called `res`. In this case, we just print it to the console `res => console.log(res)`

* `.catch()` - is what will be called when we invoke `reject`.We have created an `Error` object when we called `reject` (`reject(Error(`${number} is negative`))`). Hence our callback function now takes an error object with an error message that we log to the console `err => console.log(err.message)`

## A more proper example
As you can see, writing our own promisified function is not that complicated. And I now hope that you, by understanding the inner workings of promises, understand more about how they work.

Let's do it again, with a more complicated example. Let's fetch some data over http(s), and let's do it by turning it into promises.

Here's the code, let's go through it below.

```javascript
const https = require('https');

function get(url) {
  return new Promise(function (resolve, reject) {
    https.get(url, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const parsedData = JSON.parse(data);
        resolve(parsedData);
      });
    });
  });
}
```

1. The first line of the function is creating the promise again (`new Promise`) and setting up the two callback functions (`resolve, reject`)
1. On the second line (`https.get(url, res => {`) we do the `GET` and pass the `url` to get data from, as well as the callback function that will receive the result `res`
1. We then initialize a string for the data, on line 3
1. Line 4 is the way that we receive data using the `https`-module. We keep appending new `chunks` of data to the string `data`.
1. Line 5 is where we end up when there is no more data to get, (`.on('end')`). This, in turn, is a callback which will handle the data
1. Finally, on line 6 we can parse the string  `data` into a JSON object by doing `JSON.parse(data)`
1. We are now done and `resolve` the promise by passing the parse data as data to the resolve function `resolve(parsedData)`

Ok - that was a bit long. Let's do it again, faster. Here's a function that wraps the `get` we just wrote.

```javascript
function getPlayer(id) {
  return new Promise(function (resolve, reject) {
    const url = 'https://swapi.co/api/people/' + id + '/';
    get(url)
      .then(data => { resolve(data) });
  })
}
```

* Notice how this function is also returning a `new Promise`.
* Notice that on line 3 we are calling the `get` function
* and receiving the result on line 4 in the `.then(data)` callback.
* We then, resolve the promise of our `getPlayer` function on line 4, passing the data `resolve(data)`

We can now call the `getPlayer` promise and receive the result in a `.then` callback:

```javascript
getPlayer(13)
  .then(player => { console.log(`We got ${player.name}`) })
```

We print to the console and see `We got Chewbacca` printed in the console.

## Summary
Promises is a way for us to handle asynchronous execution in JavaScript. It's easier to read than nested callbacks that often ends up becoming a mess of curly braces.

Writing your own promisfied function is not very complicated and it teaches you a lot about how promises work internally. And that's not that complicated either - once you understand what it is all about.

More resources:
* [JavaScript Promises: an Introduction](https://developers.google.com/web/fundamentals/primers/promises)
* [Promises with MPJ](https://www.youtube.com/watch?v=2d7s3spWAzo)
* [JavaScript promises in 10 minutes](https://www.youtube.com/watch?v=DHvZLI7Db8E)