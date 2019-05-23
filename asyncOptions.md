With the advent of `async/await` we have several options for handling the asynchronous flow of code in our programs. In this post, I wanted to compare them and give some background and recommendation.

## Why asynchronous program flow?

Asynchronous means not occurring at the same time. We need that in software development because some of the things that we do (manipulating files, calling databases or APIs) takes a "long" time. 

Imagine, for example, that our browser requests a web page, that takes 2 seconds to load, and does that in a synchronous fashion, locking the main thread that displays the UI. During the entire request and rendering of the page, our browser will be unresponsive; you can't change tab, you can't click anywhere or even close the browser window. Pretty annoying, huh? 

Now imagine that our server is doing that same request, for two seconds. This is even worse; because now **everyone** accessing the server will have to wait for one request to finish before the next is served. If 3 people issue the request at the same time the last person has waited 3x2 seconds before a response is returned back. 

JavaScripts way to handle this problem is to do asynchronous calls, meaning that the request is done on another thread so that the main thread is freed up to do other things (respond to clicks in the browser and handle another request on the server). Once the request returns it will get onto the main thread again and be returned back to the user. 

## Options, options, options 

With the advent of the `async/await` keywords we now have three main options to do asynchronous code in JavaScript:

* [callbacks](callingBack ) where we supply the calling code with a function that it will call once the main code returns. 

* [Promise](makingPromises) - is a JavaScript object that encapsulates the asynchronousity for us. A promise has a `.then()` function where we can supply code that gets executed when the asynchronous code completes and a `.catch()` function that gets called when the function fails

* `async/await` - is syntactical sugar to enable us to write asynchronous code so that it looks and feels like synchronous code. It's very cool, but can also be pretty confusing.

Let's go through each option with an example

## An example

In this example, we are handling a web request from a client (so this is server-side code). We handle the request by writing a file and then returning a response. If the writing fails we want to return an error code to the client. 

### Implementing the example using callbacks

```javascript
const express = require('express');
const app = express();
const fs = require('fs');
const uuid = require('uuid/v4');
// ...
// Some other code that is not relevant for this example
// ...

app.post('/api/carts', async (req, res) => {
  const id = uuid();
  fs.writeFile('db/development/carts/' + id, '[]', (error) => {
    if (error) {
      res
        .set('message', 'It failed ' + error)
        .status(401)
        .send();
    }

    res
      .set('location', `/api/carts/${id}`)
      .status(201)
      .send(JSON.stringify({ id: id }));
  });
});

module.exports.app = app;
```

The start is some basic setup of the Express server etc. The real code starts in the route-handler (`app.post('/api/carts', (req, res) => {`), on line 9.

* On line 11 we call `fs.writeFile` passing it a file name (`'db/development/carts/' + id`), initial content (`'[]'`) then a callback function, that will be called once the file is written; 
  * The callback function takes an error parameter, that will contain an error if one is present.
  * Sure enough, the first thing we need to check for is if there's an error (`if (error)`). If so we format an appropriate response to the client
  * If there is no error we format a success response by sending back 
    * a location for the newly created resource (`.set('location', '/api/carts/'+ id')`), 
    * the status code OK (`.status(201)`) 
    * as well as some JSON (`.send(JSON.stringify({ id: id }));`)

### Implementing the example using Promises

```javascript
const express = require('express');
const app = express();
const fs = require('fs');
const uuid = require('uuid/v4');
// ...
// Some other code that is not relevant for this example
// ...
const util = require('util');
const writeFilePromise = util.promisify(fs.writeFile);

app.post('/api/carts', (req, res) => {
  const id = uuid();
  writeFilePromise('db/development/carts/' + id, '[]')
    .then(() => {
    res
      .set('location', `/api/carts/${id}`)
      .status(201)
      .send(JSON.stringify({id : id}));
  })
    .catch(error => {
    res
      .set('message', 'It failed + ', error)
      .status(401)
      .send();
  });
});

module.exports.app = app;
```

* In order to use a promise version here, we use a built-in Node feature; `util.promisify`, to create a new function called `writeFilePromise`
  * Quite simple this creates a promised version of a function that we pass to it. Much like what I did in the [blog post on Promises](makingPromises) 
  * By doing this, the `fs.writeFile` function now has a `.then()` and a `.catch()` that we can utilize
* The `.then()` function is what gets called when the `writeFilePromise` 
  * Here we create the same response as before and send `201` back, as well as the location of the newly created id and location
* The `.catch()` gets called when the `writeFilePromise` fails with an error, that gets passed to function
  * Here we create the error message to return and return `500` as status

### Implementing the example using async/await

```javascript
const express = require('express');
const app = express();
const fs = require('fs');
const uuid = require('uuid/v4');
// ...
// Some other code that is not relevant for this example
// ...
const util = require('util');
const writeFilePromise = util.promisify(fs.writeFile);

app.post('/api/carts', async (req, res) => {
  const id = uuid();
  try {
    const id = uuid();
    await writeFilePromise('db/development/carts/' + id, '[]');

    res
      .set('location', `/api/carts/${id}`)
      .status(201)
      .send(JSON.stringify({ id: id }));
  } catch (error) {
    res
      .set('message', 'It failed + ', error)
      .status(401)
      .send();
  }
});

module.exports.app = app;
```

The async/await version is fun since you can't really tell that the code is asynchronous by just looking at it. `async/await` lets us write asynchronous code as if it was synchronous. 

* First thing to notice is that in order to use the keyword `await`  we need to mark the function we want to use `await` in with the keyword `async`

* The next thing to notice is that we are using so-called structured error handling with `try-catch` . 

  * If the code that we running inside the `try` block fails it will throw an error. 
  * That error will be `catch`' ed  in the `catch` block

* We will then call `writeFilePromise`, but notice that we are not supplying a callback, nor are we supplying the `.then()` and `.catch()` methods of promises.

  * Instead we prefix the call to `writeFilePromise` with the keyword `await`. You can read this as

    > Node, run this on a separate thread and once `writeFilePromise` is complete continue here

* This means that we can now safely continue our code on the line below as if the `writeFilePromise` has completed without errors. Because that is the state when we've reached this point

  * Here we simply create a `201` response to the client

* If the `writeFilePromise` fails it will throw us an error and we will end up in the `catch`-block

  * Here we can create a `401` error to the client

## Comparision

### Flow

First, let's see how the asynchronous flow is handled by different approaches:

* **Callbacks** handle flow by supplying a declaration of a function that will be called once the original function has completed
* **Promises** handle flow by supplying a `.then()` function that will be called once the original function has completed
* **async/await** handle flow by the syntactical sugar that the `await` keyword supplies so that we can write the code as if it was synchronous even though it is asynchronous. Quite simple if we reach the line below the line with the `await` call, the call has succeeded

### Error handling

Errors are handled a bit differently per approach

- **Callbacks** handle errors by (often) supplying an error parameter (often as the first parameter too) to the callback that we supply to the original function. If this error parameter is `undefined` there was no error. Therefore we often see lines like `if(error)` in our callbacks to check for errors
- **Promises** handle errors by supplying a `.catch()` function that will be called if the original function has an error. This `.catch()` gets passed an error object that contains more information about the error that happened.
- **async/await** handle errors through the structured error handling with `try catch`. If the asynchronous function we call with `await` fails/throws an error we will end up in the `catch`-block and can handle the error there. The `catch`-block gets passed the error object that contains more information about the error that occurred. 

### Pros and cons

This section will, of course, contain some personal (Marcus) opinions but might still be useful.

* Callbacks mostly have cons...
  * They are pretty clunky to write and read
  * Often end up to be a [callback hell](https://medium.com/gousto-engineering-techbrunch/avoiding-callback-hell-97734e303de1) with a bunch of nested callbacks
  * Error handling is a mess since we have to do a lot of checks, one per callback
  * You can't really do the thing you wanted until the innermost callback which means that you need to pass or declare all things you need in outer scopes
* Promises have a lot of benefits over callbacks. They are:
  * Much clearer to read through the structured `.then()`
  * Allows for chaining of calls which will propagate into the next `.then()` without creating deep callback structures
  * Can have one `.catch()` for many promise calls
* Promises have a few drawbacks
  * They are still a bit strange to wrap your head around
  * Not everything is promised yet (can handle promises) and I need to wrap it using `util.promisify` or write it myself
  * Long chains of `.then()` are still hard to read
* Async / await in turn is even better
  *  Allows me to write asynchronous code as it if it was synchronous, which is much easier to reason about
  * Uses structured error handling through `try catch` which allows for easier to read error handling
  * Is less invasive in my code than other options and simply requires a few keywords additions
* Async / await is not perfect though
  * Allows me to write asynchronous code as it if it was synchronous … but it is not synchronous. This can sometimes be confusing. 

## Summary - what should I choose then?

Use the most advanced option you have to your disposal

* If you can - use `async / await`
* If not - try to use Promises, maybe by wrapping an old version of the interface in `util.promisify` 
* If not - well then you are stuck with callbacks, my friend. Hold on!

But most importantly - ensure that you understand how asynchronous code work under whatever solution you decide to use.