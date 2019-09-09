## Callbacks part II - call me back, will ya?

This blog post can also be [viewed as a screencast](https://youtu.be/VYA917W9IRs), if you rather hear it than read it.

This is the second part in my series that tries to untangle the concept of callback functions (callbacks in short). The first one is about the foundation of callbacks - [passing functions as parameters.](passingFunctions.md)

### Why?! Dear Lord... WHHYYYY??

Callback functions are plentiful in JavaScript development due to a simple constraint in our platform (both Node and any browser): it's single threaded. This means that only one thing can happen at the same time in any program we write.

For example let's say that I have to get some data from a Star Wars api that always takes 2 seconds to respond. That means that when you call the server **everyone else** has to wait for at least two seconds before another call to the server can be expedited.

Or in a browser it would mean that the page would be totally blank and unresponsive until the API has returned.

This is called a synchronous programming model, where the code is executed one step at the time until all the operations are completed.

1. Call SW API
2. Wait (block) until call from SW API is complete
3. Return data to client

Clearly we don't want people to wait like that that so there's a way to handle this using asynchronous programming.

Using asynchronous programming we would instead get a model like this:

1. Call SW API, passing it a function to call once it completes

2. Tell Node that it could server another request while we wait (by returning immediately, see below)

Later, when the SW API, decides to return, it will call the function we passed it.

### Examples! Now!

This is all very theoretical and much easier to understand with an example in code.

Let's do something simple first. There's a built in function in Node that waits for a given time. It's called `setTimeout` and uses callback functions. It will serve as a good starting point.

The defintion of `setTimeout` is something like:

```javascript
function setTimeout(callback, timeout, args);
```

Here's how to use it

```javascript
function myFunc(arg) {
  console.log(`arg was => ${arg}`);
}

setTimeout(myFunc, 1500, 'funky');
```

If you execute that (`node index.js`) your program will halt for ... 1500 ms and then call `myFunc`, passing it `funky` as parameter.

Now, if you read the previous blog post on passing functions as parameters, you know that this can be shortened and inlined. Like this:

```javascript
const myFunc = arg => console.log(`arg was => ${arg}`);
setTimeout(myFunc, 1500, 'funky');
```

and then inlined like this:

```javascript
setTimeout(arg => console.log(`arg was => ${arg}`), 1500, 'funky');
```

Or, if the function was more than one line it would look something like this:

```javascript
setTimeout(arg => {
  console.log('Callback called');
  console.log(`arg was => ${arg}`);
}, 1500, 'funky');
```

### A question about timings

To better understand the asynchronous nature of this code. Let's add two `console.log` statements. Like this:

```javascript
console.log('Before asynchronous function call');

setTimeout(arg => {
  console.log('Callback called');
  console.log(`arg was => ${arg}`);
}, 1500, 'funky');

console.log('After asynchronous function call');
```

Before you run this stop and think. What do you think will happen?

Ok - done that? Now run it `node index.js ` and check the output

```bash
Before asynchronous function call
After asynchronous function call
Callback called
arg was => funky
```

Now wait... what!?

Well, when you call `setTimeout` above the code return immediately. Continuing on to the next line without missing a millisecond. This is they way that Node signals that another request can use the main thread while we wait for the callback to be called.

1500 ms later, the callback is called by `setTimeout` and we get the `console.log`-statments printed.

You can view it as if you are declaring what should happen when the callback is executed, without actually executing it. That is done later, by `setTimeout`.

### Ok, but I meant a real example…

I agree - that same `setTimeout`-thingy a bit contrived. Let's write something ourselves, that ressembles what you usually do in the code.

Remember when we got players from the SWAPI? Let's see if that is easier to understand now that we know more about callbacks.

Here is how we are going to call this function:

```javascript
const client = require('./playersClient');

const printPlayer = function (player) {
  console.log('Whoopie! We were called back');
  console.log(`We got ${player.name}`)
}

client.getPlayer(1, printPlayer);
```

 And if we abbreviated and inlined the function it looks like this:

```javascript
const client = require('./playersClient');

client.getPlayer(1, player => {
  console.log('Whoopie! We were called back');
  console.log(`We got ${player.name}`)
});
```

In other words:

* call `getPlayer`
  * use 1 as the first parameter
  * use the inlined function as second parameter

Save that file as `playersService.js`

And now, lets see the implementation of the `playersClient.js`:

```javascript
const https = require('https');

function getPlayer(id, callback) {
  const url = 'https://swapi.co/api/people/' + id + '/';
  get(url, callback);
}

function get(url, callback) {
  https.get(url, res => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      const parsedData = JSON.parse(data);
      callback(parsedData)
    });
  });
}

module.exports.getPlayer = getPlayer;
```

Save that file as `playersClient.js` and run the example using `node playersService.js`

First point of interest is the `getPlayer`-function on line 3. See how it takes two parameters, an `id` and then a callback function.

We construct a `url` and then call the `get`-function, passing the `url` and the `callback` that we got sent in. That is the function parameter that we created inline in the calling code. This one:

```javascript
player => {
  console.log('Whoopie! We were called back');
  console.log(`We got ${player.name}`)
}
```

In the `get`-method we get two parameters, a `url` and a `callback`.

We then use the `https.get`-function to get the data. Notice how they are also using callbacks. One that get's called when the `data` message is recieved and another on the `end`-message.

Look carefully on the `res.on('end'` -line . See how it's using the `callback`-parameter. Since that parameter is a function we can call it (`callback();`).

Not only call it but also pass it some data to that function. In this case we pass the `person`-constant created with `const parsedData = JSON.parse(data);`.

```javascript
const parsedData = JSON.parse(data);
callback(parsedData);
```

What is that `callback`? That is the function that we defined in our calling code. This one

```javascript
player => {
  console.log('Whoopie! We were called back');
  console.log(`We got ${player.name}`)
}
```

So, once the `end`-message is received we will parse the data and call the `callback` passing `parsedData` as the `player` parameter.

Whee-he! That was a mouthful.

## Summary

I hope that this made the flow easier to follow.

* Callback functions (or callbacks for short) are functions that we pass as parameters
* By using callback functions we can get an asynchronous flow going, asking the long running code to call us back
* This means that the main thread is free to do other things (serve the next request for example)
* It's very common for callback functions to be inlined and abbreviated (using the `=>` syntax) making them a bit messy to read. But now that should be clearer for you too
